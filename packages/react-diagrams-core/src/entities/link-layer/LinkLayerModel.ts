import { FactoryBank, LayerModel, LayerModelGenerics } from '@projectstorm/react-canvas-core';
import { LinkModel } from '../link/LinkModel';
import { DiagramEngine } from '../../DiagramEngine';
import { DiagramModel } from '../../models/DiagramModel';

export interface LinkLayerModelGenerics extends LayerModelGenerics {
	CHILDREN: LinkModel;
	ENGINE: DiagramEngine;
}

export class LinkLayerModel<G extends LinkLayerModelGenerics = LinkLayerModelGenerics> extends LayerModel<G> {
	static isa<T extends LinkLayerModelGenerics = LinkLayerModelGenerics>(value: unknown): value is LinkLayerModel<T> {
		return value instanceof LinkLayerModel;
	}
	constructor() {
		super({
			type: 'diagram-links',
			isSvg: true,
			transformed: true
		});
	}

	addModel(model: G['CHILDREN']): void {
		if (!(model instanceof LinkModel)) {
			throw new Error('Can only add links to this layer');
		}
		model.registerListener({
			entityRemoved: () => {
				(this.getParent() as DiagramModel).removeLink(model);
			},
			sourcePortChanged: () => {},
			targetPortChanged: () => {},
			selectionChanged: () => {},
			lockChanged: () => {},
			eventWillFire: () => {},
			eventDidFire: () => {}
		});
		super.addModel(model);
	}

	getLinks() {
		return this.getModels();
	}

	getChildModelFactoryBank(engine: G['ENGINE']): FactoryBank<any> {
		return engine.getLinkFactories();
	}
}
