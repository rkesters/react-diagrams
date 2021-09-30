import { DiagramEngine, PortModel } from '@projectstorm/react-diagrams';
import { AbstractModelFactory } from '@projectstorm/react-canvas-core';

export class SimplePortFactory extends AbstractModelFactory<PortModel, DiagramEngine> {
	cb: (initialConfig?: any) => PortModel;

	constructor(type: string, cb: (initialConfig?: any) => PortModel, engine: DiagramEngine) {
		super(type, engine);
		this.cb = cb;
	}

	generateModel(event): PortModel {
		return this.cb(event.initialConfig);
	}
}
