import * as _ from 'lodash';
import { LinkModel } from '../entities/link/LinkModel';
import { NodeModel } from '../entities/node/NodeModel';
import {
	BaseEntityEvent,
	BaseEntityListener,
	BaseModel,
	CanvasModel,
	CanvasModelGenerics,
	LayerModel,
	DeserializeEvent,
	CanvasListener
} from '@projectstorm/react-canvas-core';
import { NodeLayerModel } from '../entities/node-layer/NodeLayerModel';
import { LinkLayerModel } from '../entities/link-layer/LinkLayerModel';
import { reduce } from 'lodash';

export interface DiagramListener extends CanvasListener {
	nodesUpdated(event: BaseEntityEvent & { node: NodeModel; isCreated: boolean }): void;

	linksUpdated(event: BaseEntityEvent & { link: LinkModel; isCreated: boolean }): void;
}

export interface DiagramModelGenerics extends CanvasModelGenerics {
	LISTENER: DiagramListener;
}

export class DiagramModel<G extends DiagramModelGenerics = DiagramModelGenerics> extends CanvasModel<G> {
	protected activeNodeLayer: NodeLayerModel | undefined;
	protected activeLinkLayer: LinkLayerModel | undefined;

	constructor(options: G['OPTIONS'] = {}) {
		super(options);
		this.addLayer(new LinkLayerModel());
		this.addLayer(new NodeLayerModel());
	}

	deserialize(event: DeserializeEvent<ReturnType<DiagramModel['serialize']>>) {
		this.layers = [];
		super.deserialize(event);
	}

	addLayer(layer: LayerModel<any>): void {
		super.addLayer(layer);
		if (layer instanceof NodeLayerModel) {
			this.activeNodeLayer = layer;
		}
		if (layer instanceof LinkLayerModel) {
			this.activeLinkLayer = layer;
		}
	}

	getLinkLayers(): LinkLayerModel[] {
		return this.getLayers().filter( (layer): layer is LinkLayerModel => {
			return LinkLayerModel.isa(layer);
		}) ;
	}

	getNodeLayers(): NodeLayerModel[] {
		return _.filter(this.layers, (layer) => {
			return layer instanceof NodeLayerModel;
		}) as NodeLayerModel[];
	}

	getActiveNodeLayer(): NodeLayerModel | undefined {
		if (!this.activeNodeLayer) {
			const layers = this.getNodeLayers();
			if (layers.length === 0) {
				this.addLayer(new NodeLayerModel());
			} else {
				this.activeNodeLayer = layers[0];
			}
		}
		return this.activeNodeLayer;
	}

	getActiveLinkLayer(): LinkLayerModel | undefined {
		if (!this.activeLinkLayer) {
			const layers = this.getLinkLayers();
			if (layers.length === 0) {
				this.addLayer(new LinkLayerModel());
			} else {
				this.activeLinkLayer = layers[0];
			}
		}
		return this.activeLinkLayer;
	}

	getNode(node: string | null | undefined): NodeModel | undefined {
		for (const layer of this.getNodeLayers()) {
			const model = layer.getModel(node);
			if (model) {
				return model;
			}
		}
	}

	getLink(link: string | undefined | null): LinkModel | undefined {
		if (!link) return;
		for (const layer of this.getLinkLayers()) {
			const model = layer.getModel(link);
			if (model) {
				return model;
			}
		}
	}

	addAll(...models: BaseModel[]): BaseModel[] {
		_.forEach(models, (model) => {
			if (model instanceof LinkModel) {
				this.addLink(model);
			} else if (model instanceof NodeModel) {
				this.addNode(model);
			}
		});
		return models;
	}

	addLink(link: LinkModel): LinkModel {
		this.getActiveLinkLayer()?.addModel(link);
		this.fireEvent(
			{
				link,
				isCreated: true
			},
			'linksUpdated'
		);
		return link;
	}

	addNode(node: NodeModel): NodeModel {
		this.getActiveNodeLayer()?.addModel(node);
		this.fireEvent({ node, isCreated: true }, 'nodesUpdated');
		return node;
	}

	removeLink(link: LinkModel) {
		const removed = _.some(this.getLinkLayers(), (layer) => {
			return layer.removeModel(link);
		});
		if (removed) {
			this.fireEvent({ link, isCreated: false }, 'linksUpdated');
		}
	}

	removeNode(node: NodeModel) {
		const removed = _.some(this.getNodeLayers(), (layer) => {
			return layer.removeModel(node);
		});
		if (removed) {
			this.fireEvent({ node, isCreated: false }, 'nodesUpdated');
		}
	}

	getLinks(): LinkModel[] {
		return _.flatMap(this.getLinkLayers(), (layer) => {
			return _.values(layer.getModels());
		});
	}

	getNodes(): NodeModel[] {
		return _.flatMap(this.getNodeLayers(), (layer) => {
			return _.values(layer.getModels());
		});
	}
}
