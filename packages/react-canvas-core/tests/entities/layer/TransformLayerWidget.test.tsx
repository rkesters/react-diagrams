import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { BaseModel, BaseModelGenerics } from '../../../src/core-models/BaseModel';
import { AbstractModelFactory, GenerateModelEvent } from '../../../src/core/AbstractModelFactory';
import { AbstractReactFactory, GenerateWidgetEvent } from '../../../src/core/AbstractReactFactory';
import { FactoryBank, FactoryBankListener } from '../../../src/core/FactoryBank';
import { CanvasModel, CanvasModelGenerics } from '../../../src/entities/canvas/CanvasModel';
import { CanvasWidget } from '../../../src/entities/canvas/CanvasWidget';
import { LayerModel, LayerModelGenerics, LayerModelOptions } from '../../../src/entities/layer/LayerModel';
import mockConsole from 'jest-mock-console';
import { Action, InputType } from '../../../src/core-actions/Action';

import { TransformLayerWidget } from '../../../src/entities/layer/TransformLayerWidget';
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

	constructor(props: LayerModelOptions ={}) {
		super({ type: 'test' , ...props});

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

describe('TransformLayerWidget', () => {
	test('Constructor', async () => {
		const engine = new CanvasEngine();
		engine.getLayerFactories().registerFactory(new Factory('test'));
		const result = render(<TransformLayerWidget layer={new TestLayer()} > <div id="child" /> </TransformLayerWidget>);
		expect(result.container.querySelector('.css-12q0bj3')).not.toBeNull();
		expect(result.container.querySelector('#child')).not.toBeNull();
		const svg = render(<TransformLayerWidget layer={new TestLayer({isSvg: true})} />);
		expect(svg.container.querySelector('svg')).not.toBeNull();

	});
	test('getTransformStyle', async () => {
		const engine = new CanvasEngine();
		engine.getLayerFactories().registerFactory(new Factory('test'));

		const layer = new TestLayer();
		const widget = new TransformLayerWidget({ layer });
		layer.setParent(new CanvasModel());

		expect(widget.getTransformStyle()).toMatchSnapshot();
		layer.getOptions().transformed = true;
		expect(widget.getTransformStyle()).toMatchSnapshot();

		layer.getParent().setOffsetX(10);
		expect(widget.getTransformStyle()).toMatchSnapshot();
		layer.getParent().setOffsetY(20);
		expect(widget.getTransformStyle()).toMatchSnapshot();
	});

});
