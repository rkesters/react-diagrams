import { Toolkit } from '@projectstorm/react-canvas-core';
import { render } from '@testing-library/react';
import React from 'react';
import { Point } from '@projectstorm/geometry';
import { DiagramEngine } from '../../../src/DiagramEngine';
import { LabelModel } from '../../../src/entities/label/LabelModel';
import { LinkModel } from '../../../src/entities/link/LinkModel';
import { LinkWidget } from '../../../src/entities/link/LinkWidget';
import { PointModel } from '../../../src/entities/link/PointModel';
import { NodeModel } from '../../../src/entities/node/NodeModel';
import { PortModel } from '../../../src/entities/port/PortModel';
import { TestLinkFactory, TestReactFactory } from '../../support/impls/TestLayer';

describe('LinkWidget', () => {
	beforeEach(() => {
		Toolkit.TESTING = true;
		Toolkit.TESTING_UID = 0;
	});
	afterEach(() => {
		Toolkit.TESTING = false;
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
	])('Render', async (tc) => {
		const linkModel: LinkModel = new LinkModel(tc.options);
		tc.source ? linkModel.setSourcePort(tc.source) : null;
		tc.source ? tc.source.setParent(new NodeModel({})) : null;
		tc.target ? linkModel.setTargetPort(tc.target) : null;
		tc.target ? tc.target.setParent(new NodeModel({})) : null;
		expect(!!linkModel.getSourcePort()).toBe(!!tc.source);
		tc.labels.forEach((label) => {
			linkModel.addLabel(label);
		});
		const diagramEngine: DiagramEngine = new DiagramEngine({});
		diagramEngine.getLabelFactories().registerFactory(new TestReactFactory('test'));
		diagramEngine.getLinkFactories().registerFactory(new TestLinkFactory('test'));

		const widget = render(<LinkWidget link={linkModel} diagramEngine={diagramEngine}></LinkWidget>, {
			wrapper: ({ children }) => <svg>{children}</svg>
		});

		expect(widget.baseElement).toMatchSnapshot();
		widget.rerender(<LinkWidget link={linkModel} diagramEngine={diagramEngine}></LinkWidget>);
		expect(widget.baseElement).toMatchSnapshot();

		tc.source ? null : linkModel.setSourcePort(new PortModel({ name: 'source' }));
		widget.rerender(<LinkWidget link={linkModel} diagramEngine={diagramEngine}></LinkWidget>);
		expect(widget.baseElement).toMatchSnapshot();

		tc.target ? null : linkModel.setTargetPort(new PortModel({ name: 'tgt' }));
		widget.rerender(<LinkWidget link={linkModel} diagramEngine={diagramEngine}></LinkWidget>);
		expect(widget.baseElement).toMatchSnapshot();
	});

	test('Static', () => {
		const link = new LinkModel({});
		expect(
			LinkWidget.generateLinePath(
				new PointModel({ link, position: new Point(0, 0) }),
				new PointModel({ link, position: new Point(1, 1) })
			)
		).toMatchSnapshot();
	});
});
