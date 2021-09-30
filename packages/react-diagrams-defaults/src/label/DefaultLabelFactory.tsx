import * as React from 'react';
import { DefaultLabelModel } from './DefaultLabelModel';
import { DefaultLabelWidget } from './DefaultLabelWidget';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';

/**
 * @author Dylan Vorster
 */
export class DefaultLabelFactory extends AbstractReactFactory<DefaultLabelModel, DiagramEngine> {
	constructor(engine: DiagramEngine) {
		super('default', engine);
	}

	generateReactWidget(event: {model: DefaultLabelModel}): JSX.Element {
		return <DefaultLabelWidget model={event.model} />;
	}

	generateModel(_event: any): DefaultLabelModel {
		return new DefaultLabelModel();
	}
}
