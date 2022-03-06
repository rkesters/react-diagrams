import { NodeModel } from '../../../src/entities/node/NodeModel';
import { NodeWidget } from '../../../src/entities/node/NodeWidget';
import { BasePositionModelOptions, Toolkit } from '@projectstorm/react-canvas-core';
import { Point } from '@projectstorm/geometry';
import { generateDeserializeEvent, TestPortFactory } from '../../support/impls/TestLayer';
import { DiagramEngine } from '../../../src/DiagramEngine';
import { PortModel } from '../../../src/entities/port/PortModel';
import { isEmpty } from 'lodash';
import { LinkModel } from '../../../src/entities/link/LinkModel';

type TC = {
	name: string;
	config: BasePositionModelOptions;
	ports?: PortModel[];
	size?: [number, number];
};

describe('NodeWidget', () => {
	Toolkit.TESTING = true;
	Toolkit.TESTING_UID = 0;
	beforeEach(() => {
		Toolkit.TESTING = true;
		Toolkit.TESTING_UID = 0;
	});
	afterEach(() => {
		Toolkit.TESTING = false;
	});
	test.each<TC>([
		{
			name: 'simple',
			config: {
				extras: {},
				position: new Point(0, 0),
				locked: false,
				selected: false,
				id: undefined,
				type: 'test'
			}
		},
		{
			name: 'Locked and Selected',
			config: {
				extras: {},
				position: new Point(0, 0),
				locked: true,
				selected: true,
				id: undefined,
				type: 'test'
			}
		},
		{
			name: 'With ID',
			config: { extras: {}, position: new Point(0, 0), id: '1090', type: 'test' }
		},
		,
		{
			name: 'With Ports',
			config: {
				extras: {},
				position: new Point(0, 0),
				locked: false,
				selected: false,
				id: undefined,
				type: 'test'
			},
			ports: [
				new PortModel({ name: 'port1', type: 'test' }),
				new PortModel({ name: 'port2', type: 'test' })
			]
		}
	])('Render: $name', (tc: TC) => {

		render()
	});

	test.each<TC>([
		{
			name: 'simple',
			config: {
				extras: {},
				position: new Point(0, 0),
				locked: false,
				selected: false,
				id: undefined,
				type: 'test'
			}
		},
		{
			name: 'Locked and Selected',
			config: {
				extras: {},
				position: new Point(0, 0),
				locked: true,
				selected: true,
				id: undefined,
				type: 'test'
			}
		},
		{
			name: 'With ID',
			config: { extras: {}, position: new Point(0, 0), id: '1090', type: 'test' }
		},
		{
			name: 'With Ports',
			config: {
				extras: {},
				position: new Point(0, 0),
				locked: false,
				selected: false,
				id: undefined,
				type: 'test'
			},
			ports: [
				new PortModel({ name: 'port1', type: 'test' }),
				new PortModel({ name: 'port2', type: 'test' })
			]
		}
	])('serialize and deserialize: $name', (tc: TC) => {
		const { config } = tc;
		const model = new NodeModel(config);
		if (!isEmpty(tc.ports)) {
			tc.ports.forEach((p) => {
				const p2 = model.addPort(p);

				expect(p.getParent()).toBe(model);
				expect(p2).toBe(p);
			});
		}
		const serial: any = model.serialize();
		expect(serial).toMatchSnapshot();
		const engine = new DiagramEngine();
		engine.getPortFactories().registerFactory(new TestPortFactory('test'));
		const event = generateDeserializeEvent(serial, engine);

		const model2 = new NodeModel({ position: new Point(10, 11), id: '100', type: 'tests' });
		model2.deserialize(event);
		expect(model2).toMatchSnapshot();
	});

	test.each<TC>([
		{
			name: 'simple',
			config: {
				extras: {},
				position: new Point(0, 0),
				locked: false,
				selected: false,
				id: undefined,
				type: 'test'
			}
		},
		{
			name: 'with height and width',
			config: {
				extras: {},
				position: new Point(0, 0),
				locked: false,
				selected: false,
				id: undefined,
				type: 'test'
			},
			size: [10, 20]
		},
		{
			name: 'With Ports',
			config: {
				extras: {},
				position: new Point(0, 0),
				locked: false,
				selected: false,
				id: undefined,
				type: 'test'
			},
			ports: [
				new PortModel({ name: 'port1', type: 'test' }),
				new PortModel({ name: 'port2', type: 'test' })
			]
		}
	])('getBoundingBox: $name', (tc: TC) => {
		const { config } = tc;
		const model = new NodeModel(config);
		if (!isEmpty(tc.ports)) {
			tc.ports.forEach((p) => {
				model.addPort(p);
			});
		}
		const [width, height] = isEmpty(tc.size ?? []) ? [0, 0] : tc.size;

		model.width = width;
		model.height = height;

		const box = model.getBoundingBox();
		expect(box).toMatchSnapshot();
	});

	test.each<TC>([
		{
			name: 'simple',
			config: {
				extras: {},
				position: new Point(0, 0),
				locked: false,
				selected: false,
				id: undefined,
				type: 'test'
			}
		},
		{
			name: 'with height and width',
			config: {
				extras: {},
				position: new Point(0, 0),
				locked: false,
				selected: false,
				id: undefined,
				type: 'test'
			},
			size: [10, 20]
		},
		{
			name: 'With Ports',
			config: {
				extras: {},
				position: new Point(0, 0),
				locked: false,
				selected: false,
				id: undefined,
				type: 'test'
			},
			ports: [
				new PortModel({ name: 'port1', type: 'test' }),
				new PortModel({ name: 'port2', type: 'test' })
			],
			size: [15, 25]
		}
	])('setPosition: $name', (tc: TC) => {
		const { config } = tc;
		const model = new NodeModel(config);
		let hasPorts = false;
		if (!isEmpty(tc.ports)) {
			tc.ports.forEach((p) => {
				model.addPort(p);
				hasPorts = true;
			});
		}
		const [width, height] = isEmpty(tc.size ?? []) ? [0, 0] : tc.size;

		model.width = width;
		model.height = height;

		model.setPosition(width, height);
		let position = model.getPosition();
		expect(position).toMatchSnapshot();

		Object.values(model.getPorts()).forEach((p) => {
			expect(p).toMatchSnapshot();
		});

		const point = new Point(width * 2, height * 2);
		model.setPosition(point);
		position = model.getPosition();
		expect(position).toMatchSnapshot();
	});

	test.each<TC>([
		{
			name: 'simple',
			config: {
				extras: {},
				position: new Point(0, 0),
				locked: false,
				selected: false,
				id: undefined,
				type: 'test'
			}
		},
		{
			name: 'with height and width',
			config: {
				extras: {},
				position: new Point(0, 0),
				locked: false,
				selected: false,
				id: undefined,
				type: 'test'
			},
			size: [10, 20]
		},
		{
			name: 'With Ports',
			config: {
				extras: {},
				position: new Point(0, 0),
				locked: false,
				selected: false,
				id: undefined,
				type: 'test'
			},
			ports: [
				new PortModel({ name: 'port1', type: 'test' }),
				new PortModel({ name: 'port2', type: 'test' })
			],
			size: [15, 25]
		}
	])('remove: $name', (tc: TC) => {
		const { config } = tc;
		const model = new NodeModel(config);
		if (!isEmpty(tc.ports)) {
			tc.ports.forEach((p) => {
				p.addLink(new LinkModel({}));
				model.addPort(p);
			});
		}
		const [width, height] = isEmpty(tc.size ?? []) ? [0, 0] : tc.size;

		model.width = width;
		model.height = height;

		model.remove();
		expect(model).toMatchSnapshot();
	});

	test.each<TC>([
		{
			name: 'simple',
			config: {
				extras: {},
				position: new Point(0, 0),
				locked: false,
				selected: false,
				id: undefined,
				type: 'test'
			}
		},
		{
			name: 'With Ports',
			config: {
				extras: {},
				position: new Point(0, 0),
				locked: false,
				selected: false,
				id: undefined,
				type: 'test'
			},
			ports: [
				new PortModel({ name: 'port1', type: 'test' }),
				new PortModel({ name: 'port2', type: 'test' })
			],
			size: [15, 25]
		}
	])('Port functions: $name', (tc: TC) => {
		const { config } = tc;
		const model = new NodeModel(config);
		let hasPort = false;
		const links: LinkModel[] = [];
		if (!isEmpty(tc.ports)) {
			tc.ports.forEach((p) => {
				const link = new LinkModel({});
				p.addLink(link);
				links.push(link);
				model.addPort(p);
				hasPort = true;
			});
		}
		const [width, height] = isEmpty(tc.size ?? []) ? [0, 0] : tc.size;

		model.updateDimensions({width,height});
		expect(model.width).toBe(width);
		expect(model.height).toBe(height);

		(tc.ports ?? []).forEach((p) => {
			expect(model.getPortFromID(p.getID())).toBe(p);
			expect(model.getPort(p.getName())).toBe(p);
		});
		if (!hasPort) {
			expect(model.getPortFromID(0)).toBeNull();
			expect(model.getPort('0')).toBeUndefined();
		}

		links.forEach((l) => {
			expect(model.getLink(l.getID())).toBe(l);
		});
		expect(model.getLink('1000')).toBeUndefined();

		(tc.ports ?? []).forEach((p) => {
			model.removePort(p);
			const ls = Object.values(p.getLinks());
			expect(model.getPortFromID(p.getID())).toBeFalsy()
		  ls.forEach(l =>	expect(model.getLink(l.getID())).toBeFalsy());
		});
	});
});
