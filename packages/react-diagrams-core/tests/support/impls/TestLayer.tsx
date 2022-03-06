import { AbstractModelFactory, AbstractReactFactory, BaseEntity, BaseModel, BaseModelGenerics, CanvasEngine, CanvasEngineListener, CanvasModel, CanvasModelGenerics, DeserializeEvent, GenerateModelEvent, GenerateWidgetEvent } from '@projectstorm/react-canvas-core';
import { promises } from 'dns';
import React from 'react';
import { DiagramEngine } from '../../../src/DiagramEngine';
import { LabelModel } from '../../../src/entities/label/LabelModel';
import { LinkModel } from '../../../src/entities/link/LinkModel';
import { PortModel } from '../../../src/entities/port/PortModel';


export function generateDeserializeEvent<T extends BaseEntity>(data: ReturnType<T['serialize']>, engine: CanvasEngine, modelsIn: BaseModel[] = [] ) {
	const models = modelsIn.reduce((acc, m) => {
		if(!m) {return acc;}
		return {...acc, [m.getID()]: m}
	}, {});
	const resolvers = {};
	const event: DeserializeEvent<T> = {
		data,
		engine,
		registerModel: (model: BaseModel) => {
			models[model.getID()] = model;
			if (resolvers[model.getID()]) {
				resolvers[model.getID()](model);
			}
		},
		async getModel<T extends BaseModel>(id: string): Promise<T> {
			//console.log(`getModel for ${id} in (${Object.keys(models).join(', ')})`)
			if (models[id]) {
				return models[id]
			}
			if (!promises[id]) {
				promises[id] = new Promise((resolve) => {
					resolvers[id] = resolve;
				});
			}
			return promises[id] as Promise<T>;
		}
	};
	return event;
}



export class TestPortFactory extends AbstractReactFactory<PortModel, DiagramEngine> {
	generateReactWidget(event: GenerateWidgetEvent<PortModel>): JSX.Element {
		return <div id={'PortModel'}> </div>;
	}
	generateModel(event: GenerateModelEvent): PortModel{
		return new PortModel(event.initialConfig ?? {});
	}
}

export class TestReactFactory extends AbstractReactFactory<LabelModel, DiagramEngine> {
	generateReactWidget(event: GenerateWidgetEvent<LabelModel>): JSX.Element {
		return <div id={'labelFactory'}> </div>;
	}
	generateModel(event: GenerateModelEvent): LabelModel{
		return new LabelModel(event.initialConfig ?? {});
	}
}

export class TestLinkFactory extends AbstractReactFactory<LinkModel, DiagramEngine> {
	generateReactWidget(event: GenerateWidgetEvent<LinkModel>): JSX.Element {
		return <div id={'linkFactory'}> </div>;
	}
	generateModel(event: GenerateModelEvent): LinkModel{
		return new LinkModel(event.initialConfig ?? {});
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
