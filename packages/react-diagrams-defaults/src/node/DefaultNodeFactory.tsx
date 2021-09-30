import * as React from 'react';
import { DefaultNodeModel } from './DefaultNodeModel';
import { DefaultNodeWidget } from './DefaultNodeWidget';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';

export class DefaultNodeFactory extends AbstractReactFactory<DefaultNodeModel, DiagramEngine> {
	constructor(engine: DiagramEngine) {
		super('default', engine);
	}

	generateReactWidget(event: {model: DefaultNodeModel}): JSX.Element {
		return <DefaultNodeWidget engine={this.engine} node={event.model} />;
	}

	generateModel(_event: any): DefaultNodeModel {
		return new DefaultNodeModel();
	}
}
