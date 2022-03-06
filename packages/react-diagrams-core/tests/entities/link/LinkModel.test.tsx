import { LinkModel } from '../../../src/entities/link/LinkModel';
import { Toolkit } from '@projectstorm/react-canvas-core';
import { PortModel } from '../../../src/entities/port/PortModel';
import { LabelModel } from '../../../src/entities/label/LabelModel';
import { DiagramEngine } from '../../../src/DiagramEngine';
import { TestReactFactory, generateDeserializeEvent } from '../../support/impls/TestLayer';
import { NodeModel } from '../../../src/entities/node/NodeModel';
import { isEmpty, map } from 'lodash';
import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { PointModel, PointModelGenerics } from '../../../src/entities/link/PointModel';

describe('LinkModel', () => {
	const context = { engine: new DiagramEngine(), paths: [] };

	beforeEach(async () => {
		context.engine = new DiagramEngine();
		context.engine.getLabelFactories().registerFactory(new TestReactFactory('test'));

		const results = render(
			<div>
				<svg id="svg" width="500" height="500" data-testid="custom-element">
					<path data-testid="custom-path" d="M 10 10 200 200 L 10 200 L200 10"></path>
					<path data-testid="custom-path2" d="M 10 10 200 200 L 10 200 L200 10"></path>
				</svg>
			</div>
		);
		const getByTestId = results.getByTestId;
		const svgPath: SVGPathElement = (await getByTestId('custom-path')) as unknown as SVGPathElement;
		const svgPath2: SVGPathElement = (await getByTestId('custom-path2')) as unknown as SVGPathElement;
		svgPath.getTotalLength = jest.fn().mockImplementation(() => 5);
		svgPath2.getTotalLength = jest.fn().mockImplementation(() => 5);
		svgPath.getPointAtLength = jest.fn().mockImplementation(() => ({ x: 2, y: 3 }));
		svgPath2.getPointAtLength = jest.fn().mockImplementation(() => ({ x: 2, y: 3 }));
		context.paths.push(svgPath2);
		context.paths.push(svgPath);
	});

	Toolkit.TESTING = true;
	beforeEach(() => {
		Toolkit.TESTING_UID = 0;
	});
	test.each([
		{
			name: 'default',
			options: { type: 'test', selected: true }
		},
		{
			name: 'Undefined Options',
			options: undefined,
			shouldThrow: false
		},
		{
			name: 'Missing values',
			options: {}
		}
	])('constructor: $name', (tc) => {
		if (tc.shouldThrow) {
			expect(() => new LinkModel(tc.options)).toThrowError();
			return;
		}
		const labelModel = new LinkModel(tc.options);
		expect(labelModel.getOptions()).toMatchSnapshot({ id: expect.any(String) });
	});

	test.each([
		{
			name: 'default',
			options: { type: 'test', selected: true },
			labels: []
		},
		{
			name: 'lables',
			options: { type: 'test', selected: false },
			labels: [new LabelModel({ type: 'test' }), new LabelModel({ type: 'test' })]
		},
		{
			name: 'Source Port',
			options: { type: 'test', selected: false },
			labels: [new LabelModel({ type: 'test' }), new LabelModel({ type: 'test' })],
			source: new PortModel({ name: 'source' }),
			target: null
		},
		{
			name: 'Target Port',
			options: { type: 'test', selected: false },
			labels: [new LabelModel({ type: 'test' }), new LabelModel({ type: 'test' })],
			target: new PortModel({ name: 'target' }),
			source: null
		},
		{
			name: 'BOTH Port',
			options: { type: 'test', selected: false },
			labels: [new LabelModel({ type: 'test' }), new LabelModel({ type: 'test' })],
			target: new PortModel({ name: 'target' }),
			source: new PortModel({ name: 'source' })
		},
		{
			name: 'No labels',
			options: { type: 'test', selected: false },
			labels: [],
			target: new PortModel({ name: 'target' }),
			source: new PortModel({ name: 'source' })
		}
	])('serialize: $name', (tc) => {
		const linkModel = new LinkModel(tc.options);
		tc.source ? linkModel.setSourcePort(tc.source) : null;
		tc.source ? tc.source.setParent(new NodeModel({})) : null;
		tc.target ? linkModel.setTargetPort(tc.target) : null;
		tc.target ? tc.target.setParent(new NodeModel({})) : null;
		expect(!!linkModel.getSourcePort()).toBe(!!tc.source);
		tc.labels.forEach((label) => {
			linkModel.addLabel(label);
		});
		const serial = linkModel.serialize();

		expect(serial).toMatchSnapshot({ id: expect.any(String) });

		if (isEmpty(tc.labels)) {
			serial.labels = undefined;
			serial.points = undefined;
		}
		const event = generateDeserializeEvent(serial, context.engine, [tc.source, tc.target]);
		linkModel.deserialize({
			...event,
			initialConfig: linkModel.getOptions()
		} as any);

		expect(linkModel.serialize()).toMatchSnapshot({ id: expect.any(String) });
	});

	test.each([
		{
			name: 'square',
			options: { type: 'test', selected: false },
			points: [
				[1, 1],
				[1, 2],
				[2, 2],
				[2, 1]
			]
		}
	])('getBoundingBox: $name', (tc) => {
		const labelModel = new LinkModel(tc.options);
		const points = tc.points.map((p) => labelModel.generatePoint(p[0], p[1]));
		labelModel.setPoints(points);
		const serial = labelModel.getBoundingBox();

		expect(serial).toMatchSnapshot();
	});

	test.each([
		{
			name: 'No ports',
			options: { type: 'test', selected: false },
			points: [
				[1, 1],
				[1, 2],
				[2, 2],
				[2, 1]
			]
		},
		{
			name: 'Source Port',
			options: { type: 'test', selected: false },
			points: [
				[1, 1],
				[1, 2],
				[2, 2],
				[2, 1]
			],
			source: new PortModel({ name: 'source' }),
			target: null
		},
		{
			name: 'Target Port',
			options: { type: 'test', selected: false },
			points: [
				[1, 1],
				[1, 2],
				[2, 2],
				[2, 1]
			],
			target: new PortModel({ name: 'target' }),
			source: null
		},
		{
			name: 'Both Ports',
			options: { type: 'test', selected: false },
			points: [
				[1, 1],
				[1, 2],
				[2, 2],
				[2, 1]
			],
			target: new PortModel({ name: 'target' }),
			source: new PortModel({ name: 'source' })
		}
	])('getSelectionEntities: $name', (tc) => {
		const labelModel = new LinkModel(tc.options);
		const points = tc.points.map((p) => labelModel.generatePoint(p[0], p[1]));
		labelModel.setPoints(points);
		tc.source ? labelModel.setSourcePort(tc.source) : null;
		tc.target ? labelModel.setTargetPort(tc.target) : null;
		expect(labelModel.getSourcePort()).toBe(tc.source ?? null);
		expect(labelModel.getTargetPort()).toBe(tc.target ?? null);
		expect(labelModel.getPoints()).toBe(points);
		expect(labelModel.getSelectionEntities()).toMatchSnapshot('getSelectionEntities');
	});

	test.each([
		{
			name: 'default',
			options: { type: 'test', selected: true },
			labels: []
		},
		{
			name: 'lables',
			options: { type: 'test', selected: false },
			labels: [new LabelModel({ type: 'test' }), new LabelModel({ type: 'test' })]
		},
		{
			name: 'Source Port',
			options: { type: 'test', selected: false },
			labels: [new LabelModel({ type: 'test' }), new LabelModel({ type: 'test' })],
			source: new PortModel({ name: 'source' }),
			target: null
		},
		{
			name: 'Target Port',
			options: { type: 'test', selected: false },
			labels: [new LabelModel({ type: 'test' }), new LabelModel({ type: 'test' })],
			target: new PortModel({ name: 'target' }),
			source: null
		},
		{
			name: 'BOTH Port',
			options: { type: 'test', selected: false },
			labels: [new LabelModel({ type: 'test' }), new LabelModel({ type: 'test' })],
			target: new PortModel({ name: 'target' }),
			source: new PortModel({ name: 'source' })
		},
		{
			name: 'No labels',
			options: { type: 'test', selected: false },
			labels: [],
			target: new PortModel({ name: 'target' }),
			source: new PortModel({ name: 'source' })
		}
	])('Paths: $name', (tc) => {
		const linkModel = new LinkModel(tc.options);
		tc.source ? linkModel.setSourcePort(tc.source) : null;
		tc.source ? tc.source.setParent(new NodeModel({})) : null;
		tc.target ? linkModel.setTargetPort(tc.target) : null;
		tc.target ? tc.target.setParent(new NodeModel({})) : null;
		expect(!!linkModel.getSourcePort()).toBe(!!tc.source);
		tc.labels.forEach((label) => {
			linkModel.addLabel(label);
		});

		linkModel.setRenderedPaths(context.paths);
		expect(linkModel.getRenderedPath()).toBe(context.paths);
	});

	test.each([
		{
			name: 'default',
			options: { type: 'test', selected: true },
			labels: []
		},
		{
			name: 'lables',
			options: { type: 'test', selected: false },
			labels: [new LabelModel({ type: 'test' }), new LabelModel({ type: 'test' })]
		},
		{
			name: 'Source Port',
			options: { type: 'test', selected: false },
			labels: [new LabelModel({ type: 'test' }), new LabelModel({ type: 'test' })],
			source: new PortModel({ name: 'source' }),
			target: null
		},
		{
			name: 'Target Port',
			options: { type: 'test', selected: false },
			labels: [new LabelModel({ type: 'test' }), new LabelModel({ type: 'test' })],
			target: new PortModel({ name: 'target' }),
			source: null
		},
		{
			name: 'BOTH Port',
			options: { type: 'test', selected: false },
			labels: [new LabelModel({ type: 'test' }), new LabelModel({ type: 'test' })],
			target: new PortModel({ name: 'target' }),
			source: new PortModel({ name: 'source' })
		},
		{
			name: 'No labels',
			options: { type: 'test', selected: false },
			labels: [],
			target: new PortModel({ name: 'target' }),
			source: new PortModel({ name: 'source' })
		}
	])('clone: $name', (tc) => {
		const linkModel = new LinkModel(tc.options);
		tc.source ? linkModel.setSourcePort(tc.source) : null;
		tc.source ? tc.source.setParent(new NodeModel({})) : null;
		tc.target ? linkModel.setTargetPort(tc.target) : null;
		tc.target ? tc.target.setParent(new NodeModel({})) : null;
		expect(!!linkModel.getSourcePort()).toBe(!!tc.source);
		tc.labels.forEach((label) => {
			linkModel.addLabel(label);
		});

		linkModel.setRenderedPaths(context.paths);
		expect(linkModel.doClone({}, new LinkModel(tc.options))).toMatchSnapshot();
	});

	test.each([
		{
			name: 'default',
			options: { type: 'test', selected: true },
			labels: []
		},
		{
			name: 'lables',
			options: { type: 'test', selected: false },
			labels: [new LabelModel({ type: 'test' }), new LabelModel({ type: 'test' })]
		},
		{
			name: 'Source Port',
			options: { type: 'test', selected: false },
			labels: [new LabelModel({ type: 'test' }), new LabelModel({ type: 'test' })],
			source: new PortModel({ name: 'source' }),
			target: null
		},
		{
			name: 'Target Port',
			options: { type: 'test', selected: false },
			labels: [new LabelModel({ type: 'test' }), new LabelModel({ type: 'test' })],
			target: new PortModel({ name: 'target' }),
			source: null
		},
		{
			name: 'BOTH Port',
			options: { type: 'test', selected: false },
			labels: [new LabelModel({ type: 'test' }), new LabelModel({ type: 'test' })],
			target: new PortModel({ name: 'target' }),
			source: new PortModel({ name: 'source' })
		},
		{
			name: 'No labels',
			options: { type: 'test', selected: false },
			labels: [],
			target: new PortModel({ name: 'target' }),
			source: new PortModel({ name: 'source' })
		}
	])('Points: $name', (tc) => {
		const linkModel = new LinkModel(tc.options);
		tc.source ? linkModel.setSourcePort(tc.source) : null;
		tc.source ? tc.source.setParent(new NodeModel({})) : null;
		tc.target ? linkModel.setTargetPort(tc.target) : null;
		tc.target ? tc.target.setParent(new NodeModel({})) : null;
		expect(!!linkModel.getSourcePort()).toBe(!!tc.source);
		tc.labels.forEach((label) => {
			linkModel.addLabel(label);
		});

		let points = linkModel.getPoints();
		const lastPoint = points[points.length - 1];
		const pointIndex = linkModel.getPointIndex(points[0]);
		expect(pointIndex).toBe(0);
		expect(linkModel.getPointIndex({ ...points[0] } as PointModel<PointModelGenerics>)).toBe(-1);
		expect(linkModel.isLastPoint(points[0])).toBeFalsy();
		expect(linkModel.isLastPoint(lastPoint)).toBeTruthy();
		expect(linkModel.getPointModel(points[0].getID())).toBe(points[0]);
		expect(linkModel.getPointModel(points[0].getID() + '12')).toBeNull();
		expect(linkModel.getFirstPoint()).toBe(points[0]);
		expect(linkModel.getLastPoint()).toBe(lastPoint);
		expect(linkModel.getPortForPoint(points[0])).toBe(tc.source ?? null);
		expect(linkModel.getPortForPoint(lastPoint)).toBe(tc.target ?? null);

		tc.source ? expect(linkModel.getPointForPort(tc.source)).toBe(points[0] ?? null) : null;
		tc.target
			? expect(linkModel.getPointForPort(tc.target)).toBe(lastPoint ?? null)
			: expect(linkModel.getPointForPort(new PortModel({ name: 'random' }))).toBe(null);

		let cloned = new LinkModel(tc.options);
		linkModel.doClone({}, cloned);
		points = cloned.getPoints();
		let removed = [...points];
		removed.splice(0, 1);
		cloned.removePoint(points[0]);
		points = cloned.getPoints();
		expect(points.map((p) => p.getID())).toEqual(removed.map((p) => p.getID()));

		cloned = new LinkModel(tc.options);
		linkModel.doClone({}, cloned);
		points = cloned.getPoints();
		removed = [...points];
		cloned.removePointsAfter(points[0]);
		removed.splice(1);
		points = cloned.getPoints();
		expect(points.map((p) => p.getID())).toEqual(removed.map((p) => p.getID()));

		cloned = new LinkModel(tc.options);
		linkModel.doClone({}, cloned);
		points = cloned.getPoints();
		removed = [...points];
		cloned.removePointsBefore(points[1]);
		removed.splice(0, 1);
		points = cloned.getPoints();
		expect(points.map((p) => p.getID())).toEqual(removed.map((p) => p.getID()));

		cloned = new LinkModel(tc.options);
		linkModel.doClone({}, cloned);
		points = cloned.getPoints();
		const pointsBeforeAdd = cloned.getPoints();
		cloned.removeMiddlePoints();
		expect(points).toBe(pointsBeforeAdd);
		cloned.point(1, 1);
		cloned.point(2, 1);
		points = cloned.getPoints();
		expect(points).toHaveLength(4);
		cloned.removeMiddlePoints();
		points = cloned.getPoints();
		expect(points).toBe(pointsBeforeAdd);

		cloned = new LinkModel(tc.options);
		linkModel.doClone({}, cloned);

		const src = cloned.getSourcePort();
		const tgt =cloned.getTargetPort();
		cloned.clearPort(new PortModel({ name: 'target' }));
		expect(cloned.getSourcePort()).toBe(src)
		expect(cloned.getTargetPort()).toBe(tgt)

		cloned.clearPort(cloned.getSourcePort());
		expect(cloned.getSourcePort()).toBeNull();
		cloned.clearPort(cloned.getTargetPort());
		expect(cloned.getTargetPort()).toBeNull();

		cloned = new LinkModel(tc.options);
		linkModel.doClone({}, cloned);
		cloned.remove();
		expect(map(cloned.getSourcePort()?.getLinks() ?? {},(p => p.getID()))).toHaveLength(0);
		expect(map(cloned.getTargetPort()?.getLinks() ?? {},(p => p.getID()))).toHaveLength(0);

	});
});
