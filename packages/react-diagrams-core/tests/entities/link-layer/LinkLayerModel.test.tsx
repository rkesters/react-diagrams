import { LinkLayerModel } from '../../../src/entities/link-layer/LinkLayerModel';
import { LinkModel } from '../../../src/entities/link/LinkModel';
import { Toolkit } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '../../../src/DiagramEngine';
import { TestLinkFactory, TestReactFactory } from '../../support/impls/TestLayer';
import { DiagramModel } from '../../../src/models/DiagramModel';
import debug from 'debug';

const dbg = debug('reactDiagrams:diagramCore:test:LinkLayerModel');
describe('LinkLayerModel', () => {
	beforeEach(() => {
		Toolkit.TESTING = true;
		Toolkit.TESTING_UID = 0;
	});
	afterEach(() => {
		Toolkit.TESTING = false;
	});
	test('constructure', async () => {
		const model = new LinkLayerModel();
		expect(model).toMatchSnapshot();
		const linkModel = new LinkModel({});

		model.addModel(linkModel);
		expect(model.getLinks()).toStrictEqual({[linkModel.getID()]: linkModel});
		const engine = new DiagramEngine();
		const factory = new TestLinkFactory('test');
		engine.getLinkFactories().registerFactory(factory);
		expect(model.getChildModelFactoryBank(engine)).toBe(engine.getLinkFactories());
		expect(() => model.addModel({} as any)).toThrow();

		const parent = new DiagramModel({});
		model.setParent(parent);
		parent.addLink(linkModel);
		expect((model.getParent() as DiagramModel ).getLinks()).toHaveLength(1);
		linkModel.fireEvent( {},'entityRemoved');
		expect((model.getParent() as DiagramModel ).getLinks()).toHaveLength(0);

	});
});
