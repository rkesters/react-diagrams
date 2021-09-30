import * as React from 'react';
import { AbstractReactFactory, GenerateWidgetEvent } from '../../core/AbstractReactFactory';
import { SelectionLayerModel } from './SelectionLayerModel';
import { GenerateModelEvent } from '../../core/AbstractModelFactory';
import { SelectionBoxWidget } from './SelectionBoxWidget';
import { CanvasEngine } from '../..';

export class SelectionBoxLayerFactory extends AbstractReactFactory<SelectionLayerModel> {
	constructor(engine: CanvasEngine) {
		super('selection', engine);
	}

	generateModel(event: GenerateModelEvent): SelectionLayerModel {
		return new SelectionLayerModel();
	}

	generateReactWidget(event: GenerateWidgetEvent<SelectionLayerModel>): JSX.Element {
		return <SelectionBoxWidget rect={event.model.box} />;
	}
}
