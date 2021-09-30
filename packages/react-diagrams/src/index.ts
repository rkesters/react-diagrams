import {
	DefaultDiagramState,
	DiagramEngine,
	DiagramModel,
	LinkLayerFactory,
	NodeLayerFactory
} from '@projectstorm/react-diagrams-core';
import {
	DefaultLabelFactory,
	DefaultLinkFactory,
	DefaultNodeFactory,
	DefaultPortFactory
} from '@projectstorm/react-diagrams-defaults';
import { PathFindingLinkFactory } from '@projectstorm/react-diagrams-routing';
import { SelectionBoxLayerFactory, CanvasEngineOptions } from '@projectstorm/react-canvas-core';

export * from '@projectstorm/react-diagrams-core';
export * from '@projectstorm/react-diagrams-defaults';
export * from '@projectstorm/react-diagrams-routing';

/**
 * Construct an engine with the defaults installed
 */
export default (model: DiagramModel, options: CanvasEngineOptions = {}): DiagramEngine => {
	const engine = new DiagramEngine(model,options);

	// register model factories
	engine.getLayerFactories().registerFactory(new NodeLayerFactory(engine));
	engine.getLayerFactories().registerFactory(new LinkLayerFactory(engine));
	engine.getLayerFactories().registerFactory(new SelectionBoxLayerFactory(engine));

	engine.getLabelFactories().registerFactory(new DefaultLabelFactory(engine));
	engine.getNodeFactories().registerFactory(new DefaultNodeFactory(engine)); // i cant figure out why
	engine.getLinkFactories().registerFactory(new DefaultLinkFactory(engine));
	engine.getLinkFactories().registerFactory(new PathFindingLinkFactory(engine));
	engine.getPortFactories().registerFactory(new DefaultPortFactory(engine));

	// register the default interaction behaviours
	engine.getStateMachine().pushState(new DefaultDiagramState(engine));
	return engine;
};
