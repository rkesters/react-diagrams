import { threadId } from 'worker_threads';
import { CanvasEngine, CanvasEngineListener } from '../../../src/CanvasEngine';
import { BaseModel, BaseModelGenerics } from '../../../src/core-models/BaseModel';
import { AbstractModelFactory } from '../../../src/core/AbstractModelFactory';
import { FactoryBank, FactoryBankListener } from '../../../src/core/FactoryBank';
import { CanvasModel, CanvasModelGenerics } from '../../../src/entities/canvas/CanvasModel';
import { LayerModel } from '../../../src/entities/layer/LayerModel';
import {SelectionBoxLayerFactory} from '../../../src/entities/selection/SelectionBoxLayerFactory';

class TestLayerModel extends LayerModel {
	bank = new FactoryBank<
		AbstractModelFactory<
			BaseModel<BaseModelGenerics>,
			CanvasEngine<CanvasEngineListener, CanvasModel<CanvasModelGenerics>>
		>,
		FactoryBankListener<
			AbstractModelFactory<
				BaseModel<BaseModelGenerics>,
				CanvasEngine<CanvasEngineListener, CanvasModel<CanvasModelGenerics>>
			>
		>
	>();
	mockgetChildModelFactoryBank = jest.fn();
	getChildModelFactoryBank(
		engine: CanvasEngine<CanvasEngineListener, CanvasModel<CanvasModelGenerics>>
	): FactoryBank<
		AbstractModelFactory<
			BaseModel<BaseModelGenerics>,
			CanvasEngine<CanvasEngineListener, CanvasModel<CanvasModelGenerics>>
		>,
		FactoryBankListener<
			AbstractModelFactory<
				BaseModel<BaseModelGenerics>,
				CanvasEngine<CanvasEngineListener, CanvasModel<CanvasModelGenerics>>
			>
		>
	> {
		this.mockgetChildModelFactoryBank(engine);
		return this.bank;
	}

	m = [new BaseModel({}), new BaseModel({ selected: true })];
	getSelectionEntities = jest.fn().mockImplementation(() => this.m);
	getModels = jest.fn().mockImplementation(() => this.m);
}

describe('CanvasModel', () => {
	test.each([
		{ name: 'Default', options: undefined },
		{
			name: 'With options',
			options: {
				offsetX: 100,
				offsetY: 200,
				zoom: 43,
				gridSize: 10
			}
		}
	])('constructor $name', (tc) => {
		const model = new CanvasModel(tc.options);

		expect(model.getOptions()).toMatchSnapshot({
			id: expect.any(String)
		});
	});

	test.each([{ name: 'Default', options: undefined }])('layes $name', (tc) => {
		const model = new CanvasModel(tc.options);
		const layer = new TestLayerModel();

		model.addLayer(layer);
		expect(model.getLayers().length).toEqual(1);
		expect(model.getSelectionEntities()).toEqual(layer.m);
		expect(layer.getSelectionEntities).toBeCalled();

		expect(model.getSelectedEntities()).toEqual([layer.m[1]]);

		model.clearSelection();
		expect(model.getSelectedEntities()).toEqual([]);

		expect(model.getModels()).toEqual(layer.m);

		const layer2 = new TestLayerModel();
		model.addLayer(layer2);

		model.removeLayer(layer);
		expect(model.getLayers().length).toEqual(1);
		expect(model.getLayers()).toEqual([layer2]);

		model.setLocked();
		expect(model.isLocked()).toBeTruthy();
		model.setLocked(false);
		expect(model.isLocked()).toBeFalsy();
		model.setLocked(true);
		expect(model.isLocked()).toBeTruthy();

		model.setOffset(1000, 2000);
		expect(model.getOffsetX()).toEqual(1000);
		expect(model.getOffsetY()).toEqual(2000);

		model.setOffsetX(-100);
		expect(model.getOffsetX()).toEqual(-100);
		expect(model.getOffsetY()).toEqual(2000);
		model.setOffsetY(-200);
		expect(model.getOffsetX()).toEqual(-100);
		expect(model.getOffsetY()).toEqual(-200);
		model.setOffset(0, 0);

		model.setZoomLevel(200);
		expect(model.getZoomLevel()).toEqual(200);

		model.setGridSize(0);
		expect(model.getOptions().gridSize).toEqual(0);

		expect(model.getGridPosition(1)).toEqual(1);
		model.setGridSize(100);
		expect(model.getGridPosition(1)).toEqual(0);
		expect(model.getGridPosition(101)).toEqual(100);
	});

	test.each([{ name: 'Default', options: undefined }])('serialize $name', (tc) => {
		const model = new CanvasModel(tc.options);
		const layer = new TestLayerModel({type: 'selection' });

		model.addLayer(layer);

		const serial = model.serialize();

		expect(serial).toMatchSnapshot({ id: expect.any(String), layers: [{ id: expect.any(String) }] });

		serial.gridSize = 100;

		const engine = new CanvasEngine();
		engine.getLayerFactories().registerFactory(new SelectionBoxLayerFactory());

		model.deserialize( {data: serial, engine} as any);

		expect(model.getOptions().gridSize).toEqual(100);

		serial.gridSize = 300;
		model.deserializeModel(serial, engine);
		expect(model.getOptions().gridSize).toEqual(300);

	});
});
