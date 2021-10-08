import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { BaseModel, BaseModelGenerics } from '../../../src/core-models/BaseModel';
import { AbstractModelFactory, GenerateModelEvent } from '../../../src/core/AbstractModelFactory';
import { AbstractReactFactory, GenerateWidgetEvent } from '../../../src/core/AbstractReactFactory';
import { FactoryBank, FactoryBankListener } from '../../../src/core/FactoryBank';
import { CanvasModel, CanvasModelGenerics } from '../../../src/entities/canvas/CanvasModel';
import { CanvasWidget } from '../../../src/entities/canvas/CanvasWidget';
import { LayerModel, LayerModelGenerics } from '../../../src/entities/layer/LayerModel';
import mockConsole from 'jest-mock-console';
import { Action, InputType } from '../../../src/core-actions/Action';

import { SmartLayerWidget } from '../../../src/entities/layer/SmartLayerWidget';
import { CanvasEngine, CanvasEngineListener } from '../../../src/CanvasEngine';

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

describe('SmartLayerWidget', () => {
	test('Constructor', async () => {
		const engine = new CanvasEngine();
		engine.getLayerFactories().registerFactory(new Factory('test'));
		const result = 	render(<SmartLayerWidget engine={engine} layer={new TestLayer()} />);
		expect(result.container.querySelector('#factory')).not.toBeNull();

		const layer = new TestLayer();
		const widget = new SmartLayerWidget({engine, layer });

		expect(widget.shouldComponentUpdate()).toEqual(true);
		layer.allowRepaint(false);
		expect(widget.shouldComponentUpdate()).toEqual(false);

	});
});
