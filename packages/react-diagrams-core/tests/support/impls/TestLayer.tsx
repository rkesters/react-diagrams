import { CanvasEngine, CanvasEngineListener } from '@projectstorm/react-canvas-core';
import { BaseModel, BaseModelGenerics } from '@projectstorm/react-canvas-core';
import { AbstractModelFactory, GenerateModelEvent } from '@projectstorm/react-canvas-core';
import { AbstractReactFactory, GenerateWidgetEvent } from '@projectstorm/react-canvas-core';
import { FactoryBank, FactoryBankListener } from '@projectstorm/react-canvas-core';
import { CanvasModel, CanvasModelGenerics } from '@projectstorm/react-canvas-core';
import { LayerModel, LayerModelGenerics, LayerModelOptions } from '@projectstorm/react-canvas-core';
import React from 'react';
import { DiagramEngine } from '../../../src/DiagramEngine';
import { LabelModel } from '../../../src/entities/label/LabelModel';


export class TestReactFactory extends AbstractReactFactory<LabelModel, DiagramEngine> {
	generateReactWidget(event: GenerateWidgetEvent<LabelModel>): JSX.Element {
		return <div id={'factory'}> </div>;
	}
	generateModel(event: GenerateModelEvent): LabelModel{
		return new LabelModel(event.initialConfig);
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

// export class TestLayer extends LayerModel {
// 	#childModelFactoryBank = new FactoryBank<
// 		AbstractModelFactory<
// 			BaseModel<BaseModelGenerics>,
// 			CanvasEngine<CanvasEngineListener, CanvasModel<CanvasModelGenerics>>
// 		>,
// 		FactoryBankListener<
// 			AbstractModelFactory<
// 				BaseModel<BaseModelGenerics>,
// 				CanvasEngine<CanvasEngineListener, CanvasModel<CanvasModelGenerics>>
// 			>
// 		>
// 	>();

// 	constructor(options: LayerModelOptions = {}) {
// 		super({ type: 'test', ...options,  });

// 		this.#childModelFactoryBank.registerFactory(new TestLayerFactory());
// 	}
// 	getChildModelFactoryBank(
// 		engine: CanvasEngine<CanvasEngineListener, CanvasModel<CanvasModelGenerics>>
// 	): FactoryBank<
// 		AbstractModelFactory<
// 			BaseModel<BaseModelGenerics>,
// 			CanvasEngine<CanvasEngineListener, CanvasModel<CanvasModelGenerics>>
// 		>,
// 		FactoryBankListener<
// 			AbstractModelFactory<
// 				BaseModel<BaseModelGenerics>,
// 				CanvasEngine<CanvasEngineListener, CanvasModel<CanvasModelGenerics>>
// 			>
// 		>
// 	> {
// 		return this.#childModelFactoryBank;
// 	}
// }
