import { render, waitFor } from '@testing-library/react';
import React from 'react';
import {
	AbstractReactFactory,
	LayerModel,
	LayerModelGenerics,
	CanvasEngine,
	CanvasEngineListener,
	CanvasModel,
	CanvasModelGenerics,
	GenerateWidgetEvent,
	GenerateModelEvent
} from '../../../../react-canvas-core/dist/@types';
import { DiagramEngine } from '../../../src/DiagramEngine';
import { LabelModel } from '../../../src/entities/label/LabelModel';
import { LabelWidget } from '../../../src/entities/label/LabelWidget';
import { TestReactFactory } from '../../support/impls/TestLayer';
import '@testing-library/jest-dom';
import { LinkModel } from '../../../src/entities/link/LinkModel';

describe('LabelWidget', () => {
	describe('methods', () => {
		const tc = { engine: new DiagramEngine(), label: new LabelModel({ type: 'test' }), index: 0 };
		let getByTestId;
		const paths: SVGPathElement[] = [];

		beforeEach(async () => {
			const results = render(
				<div>
					<svg id="svg" width="500" height="500" data-testid="custom-element">
						<path data-testid="custom-path" d="M 10 10 200 200 L 10 200 L200 10"></path>
						<path data-testid="custom-path2" d="M 10 10 200 200 L 10 200 L200 10"></path>
					</svg>
				</div>
			);
			getByTestId = results.getByTestId;
			const svgPath: SVGPathElement = (await getByTestId('custom-path')) as unknown as SVGPathElement;
			const svgPath2: SVGPathElement = (await getByTestId('custom-path2')) as unknown as SVGPathElement;
			svgPath.getTotalLength = jest.fn().mockImplementation(() => 5);
			svgPath2.getTotalLength = jest.fn().mockImplementation(() => 5);
			svgPath.getPointAtLength = jest.fn().mockImplementation(() => ({ x: 2, y: 3 }));
			svgPath2.getPointAtLength = jest.fn().mockImplementation(() => ({ x: 2, y: 3 }));

			paths.push(svgPath2);
			paths.push(svgPath);
			const engine = new DiagramEngine();
			tc.engine = engine;
			tc.label = new LabelModel({ type: 'test' });
			engine.getLabelFactories().registerFactory(new TestReactFactory('test'));
			tc.label.setParent(new LinkModel({}));
			tc.label.getParent().getLabels().push(new LabelModel({}));
			tc.label.getParent().setRenderedPaths(paths);
		});

		test('findPathAndRelativePositionToRenderLabel', async () => {
			const { engine, label, index } = tc;
			const widget = new LabelWidget({ engine, label, index });
			expect(widget.findPathAndRelativePositionToRenderLabel(1)).toMatchInlineSnapshot(`
		Object {
		  "path": <path
		    d="M 10 10 200 200 L 10 200 L200 10"
		    data-testid="custom-path"
		  />,
		  "position": 0,
		}
	`);
		});
		test('calculateLabelPosition', async () => {
			const { engine, label, index } = tc;
			engine.getLabelFactories().registerFactory(new TestReactFactory('test'));
			const widget = new LabelWidget({ engine, label, index });
			(widget.ref as any).current = { offsetWidth: 100, offsetHeight: 200, style: {} };
			widget.calculateLabelPosition();
			expect(widget.ref.current.style.transform).toMatchInlineSnapshot(`"translate(-48px, -97px)"`);
		});

		test('render', async () => {
			const { engine, label, index } = tc;
			const labelFactory = new TestReactFactory('test');
			labelFactory.generateReactWidget = jest.fn().mockImplementation((event: GenerateWidgetEvent<LabelModel>) => {
				return <div id="labelFactory">label</div>;
			});
			engine.getLabelFactories().registerFactory(labelFactory);
			const w = render(
				<svg>
					<LabelWidget data-testid="widget" engine={engine} label={label} index={index}></LabelWidget>
				</svg>
			);
			await waitFor(() => {
				return expect(w.container.querySelector('svg')).toBeInTheDocument();
			});
			expect(w.container).toMatchInlineSnapshot(`
		<div>
		  <svg>
		    <foreignobject
		      class="css-1ipt3tw"
		    >
		      <div
		        class="css-157va7r"
		      >
		        <div
		          id="labelFactory"
		        >
		          label
		        </div>
		      </div>
		    </foreignobject>
		  </svg>
		</div>
	`);
		});
	});
});
