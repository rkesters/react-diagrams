import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { CanvasEngine, CanvasEngineListener } from '../../../src/CanvasEngine';
import { BaseModel, BaseModelGenerics } from '../../../src/core-models/BaseModel';
import { AbstractModelFactory, GenerateModelEvent } from '../../../src/core/AbstractModelFactory';
import { AbstractReactFactory, GenerateWidgetEvent } from '../../../src/core/AbstractReactFactory';
import { FactoryBank, FactoryBankListener } from '../../../src/core/FactoryBank';
import { CanvasModel, CanvasModelGenerics } from '../../../src/entities/canvas/CanvasModel';
import { CanvasWidget } from '../../../src/entities/canvas/CanvasWidget';
import { LayerModel, LayerModelGenerics } from '../../../src/entities/layer/LayerModel';
import mockConsole from 'jest-mock-console';
import { Action, InputType } from '../../../src/core-actions/Action';

class Factory extends AbstractReactFactory<
	LayerModel<LayerModelGenerics>,
	CanvasEngine<CanvasEngineListener, CanvasModel<CanvasModelGenerics>>
> {
	generateReactWidget(event: GenerateWidgetEvent<LayerModel<LayerModelGenerics>>): JSX.Element {
		return <div id={'factory'}> </div>;
	}
	generateModel(event: GenerateModelEvent): LayerModel<LayerModelGenerics> {
		return new TestLayer();
	}
}
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

	constructor() {
		super({ type: 'test' });

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

describe('CanvasWidget',  () => {
	test('No Model', async () => {
		const restoreConsole = mockConsole();
		const engine = new CanvasEngine();
		expect(() => {
			render(<CanvasWidget engine={engine} />);
		}).toThrowError();
		restoreConsole();
	});

	test('With Model', () => {
		const engine = new CanvasEngine();
		const canvas = new CanvasModel();
		engine.setModel(canvas);

		expect(() => {
			render(<CanvasWidget engine={engine} />);
		}).not.toThrowError();

		const body = document.querySelector('body');
		const div1 = body.querySelector('div');
		const div2 = div1.querySelector('div');
		expect(div2).toHaveAttribute('class');
	});

	test('With Layers', () => {
		const engine = new CanvasEngine();
		const canvas = new CanvasModel();

		engine.getLayerFactories().registerFactory(new Factory('test'));
		const layer = new TestLayer();
		canvas.addLayer(layer);
		engine.setModel(canvas);

		const result = render(<CanvasWidget engine={engine} />);
		expect(result.container.querySelector('#factory')).toBeDefined();

	});

	test('Events', () => {
		const engine = new CanvasEngine();
		const canvas = new CanvasModel();

		engine.getLayerFactories().registerFactory(new Factory('test'));
		const layer = new TestLayer();
		canvas.addLayer(layer);
		engine.setModel(canvas);

		const result = render(<CanvasWidget engine={engine} className={'CanvasWidget'} />);
		const widget = result.container.querySelector('.CanvasWidget');
		expect(widget).toBeDefined();

		const wheel = new Action({type: InputType.MOUSE_WHEEL , fire: jest.fn()});
		const mouseDown = new Action({type: InputType.MOUSE_DOWN, fire: jest.fn()});
		const mouseUp = new Action({type: InputType.MOUSE_UP, fire: jest.fn()});
		const mouseMove = new Action({type: InputType.MOUSE_MOVE, fire: jest.fn()});
		const touchStart = new Action({type: InputType.TOUCH_START, fire: jest.fn()});
		const touchEnd = new Action({type: InputType.TOUCH_END, fire: jest.fn()});
		const touchMove = new Action({type: InputType.TOUCH_MOVE, fire: jest.fn()});

		const keyDown = new Action({type: InputType.KEY_DOWN, fire: jest.fn()});
		const keyUp = new Action({type: InputType.KEY_UP, fire: jest.fn()});
		engine.getActionEventBus().registerAction(wheel);
		engine.getActionEventBus().registerAction(mouseDown);
		engine.getActionEventBus().registerAction(mouseUp);
		engine.getActionEventBus().registerAction(mouseMove);
		engine.getActionEventBus().registerAction(touchStart);
		engine.getActionEventBus().registerAction(touchEnd);
		engine.getActionEventBus().registerAction(touchMove);
		engine.getActionEventBus().registerAction(keyDown);
		engine.getActionEventBus().registerAction(keyUp);

		fireEvent.wheel(widget);
		expect(wheel.options.fire).toHaveBeenCalled();

		fireEvent.mouseDown(widget);
		expect(mouseDown.options.fire).toHaveBeenCalled();

		fireEvent.mouseMove(widget);
		expect(mouseMove.options.fire).toHaveBeenCalled();

		fireEvent.mouseUp(widget);
		expect(mouseUp.options.fire).toHaveBeenCalled();


		fireEvent.touchStart(widget);
		expect(touchStart.options.fire).toHaveBeenCalled();

		fireEvent.touchMove(widget);
		expect(touchMove.options.fire).toHaveBeenCalled();

		fireEvent.touchEnd(widget);
		expect(touchEnd.options.fire).toHaveBeenCalled();

		fireEvent.keyDown(widget);
		expect(keyDown.options.fire).toHaveBeenCalled();

		fireEvent.keyUp(widget);
		expect(keyUp.options.fire).toHaveBeenCalled();

	});
});
