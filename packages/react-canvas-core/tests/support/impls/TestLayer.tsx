import { CanvasEngine, CanvasEngineListener } from '../../../src/CanvasEngine';
import { BaseModel, BaseModelGenerics } from '../../../src/core-models/BaseModel';
import { AbstractModelFactory, GenerateModelEvent } from '../../../src/core/AbstractModelFactory';
import { AbstractReactFactory, GenerateWidgetEvent } from '../../../src/core/AbstractReactFactory';
import { FactoryBank, FactoryBankListener } from '../../../src/core/FactoryBank';
import { CanvasModel, CanvasModelGenerics } from '../../../src/entities/canvas/CanvasModel';
import { LayerModel, LayerModelGenerics, LayerModelOptions } from '../../../src/entities/layer/LayerModel';
import React from 'react';


export class TestReactFactory extends AbstractReactFactory<
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

export class TestLayerFactory extends AbstractModelFactory<
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

export class TestLayer extends LayerModel {
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

	constructor(options: LayerModelOptions = {}) {
		super({ ...options, type: 'test' });

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
