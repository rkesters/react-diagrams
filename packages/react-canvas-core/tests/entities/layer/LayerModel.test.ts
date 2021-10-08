import { map } from 'lodash';
import { CanvasEngine, CanvasEngineListener } from '../../../src/CanvasEngine';
import { BaseModel, BaseModelGenerics } from '../../../src/core-models/BaseModel';
import { GenerateModelEvent, AbstractModelFactory } from '../../../src/core/AbstractModelFactory';
import { AbstractReactFactory, GenerateWidgetEvent } from '../../../src/core/AbstractReactFactory';
import { FactoryBank, FactoryBankListener } from '../../../src/core/FactoryBank';
import { CanvasModel, CanvasModelGenerics } from '../../../src/entities/canvas/CanvasModel';
import { LayerModel, LayerModelGenerics, LayerModelOptions } from '../../../src/entities/layer/LayerModel';

class TestLayerFactory extends AbstractModelFactory<
	BaseModel<BaseModelGenerics>,
	CanvasEngine<CanvasEngineListener, CanvasModel<CanvasModelGenerics>>
> {
	constructor() {
		super('test');
	}
	generateModel(event: GenerateModelEvent): BaseModel<BaseModelGenerics> {
		return new BaseModel({});
	}
}

class TestLayer extends LayerModel {

	#childModelFactoryBank = new FactoryBank<
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

	constructor(options: LayerModelOptions= {}) {
		super({...options, type: 'test' });

		this.#childModelFactoryBank.registerFactory(new TestLayerFactory());
	}
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
		return this.#childModelFactoryBank;
	}
}

describe('LayerModel', () => {
	test('Contructor', () => {
		let model = new TestLayer();

		expect(model.getOptions()).toMatchSnapshot({ id: expect.any(String) });

		 model = new TestLayer({isSvg: true, transformed: true, type: 'bad'});

		expect(model.getOptions()).toMatchSnapshot({ id: expect.any(String) });
	});

	test('serialize', () => {
		const model = new TestLayer();

		let serial = model.serialize();

		expect(serial).toMatchSnapshot({ id: expect.any(String) });

		serial.id = 'dog';

		model.deserialize({ data: serial } as any);

		expect(model.serialize()).toMatchSnapshot();

		model.addModel(new BaseModel({ type: 'test' }));
		model.addModel(new BaseModel({ type: 'test' }));

		serial = model.serialize();
		model.deserialize({ data: serial } as any);

		expect(Object.keys(model.getModels()).length).toEqual(2);
		expect(Object.keys(model.getModels())).toEqual(Object.keys(serial.models));
	});

	test('getters/setters', () => {
		const model = new TestLayer();

		expect(model.isRepaintEnabled()).toEqual(true);
		model.allowRepaint(false);
		expect(model.isRepaintEnabled()).toEqual(false);
		model.allowRepaint();
		expect(model.isRepaintEnabled()).toEqual(true);
		model.allowRepaint(false);
		expect(model.isRepaintEnabled()).toEqual(false);
		model.allowRepaint(true);
		expect(model.isRepaintEnabled()).toEqual(true);

		model.addModel(new BaseModel({ type: 'test', extras: { name: 'unselected' } }));
		model.addModel(new BaseModel({ type: 'test', selected: true, extras: { name: 'selected' } }));

		const selected = model.getSelectionEntities();
		const ms = map( model.getModels(), (value) => value)

		expect(selected).toEqual(ms);

		expect(model.getModel(ms[0].getID())).toEqual(ms[0]);

		expect(model.removeModel(ms[0].getID())).toBeTruthy()
		expect(model.getModel(ms[0].getID())).toBeUndefined();

		expect(model.removeModel(ms[1])).toBeTruthy()
		expect(model.getModel(ms[1].getID())).toBeUndefined();
		expect(model.removeModel(ms[1].getID())).toBeFalsy();

		const parent = new CanvasModel();
		model.setParent(parent)
		const removeListener = {entityRemoved: jest.fn()};
		model.registerListener(removeListener);
		model.remove();
		expect(removeListener.entityRemoved).toHaveBeenCalled();


	});
});
