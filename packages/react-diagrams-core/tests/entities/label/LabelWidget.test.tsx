import { render } from '@testing-library/react';
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
	test('constructor', () => {
		const engine = new DiagramEngine();
		const model = new LabelModel({ type: 'test' });

		engine.getLabelFactories().registerFactory(new TestReactFactory('test'));
		const { container, debug } = render(
			<svg>
				<LabelWidget engine={engine} label={model} index={1}></LabelWidget>
			</svg>
		);

		expect(container.querySelector('.css-1ipt3tw')).toHaveClass('css-1ipt3tw');
		expect(container.querySelector('svg > foreignobject > .css-157va7r')).toHaveClass('css-157va7r');
		expect(container.querySelector('svg > foreignobject > .css-157va7r > #factory')).toHaveAttribute('id', 'factory');
	});

	test('findPathAndRelativePositionToRenderLabel', () => {
		const engine = new DiagramEngine();
		const label = new LabelModel({ type: 'test' });
		const index = 1;
		engine.getLabelFactories().registerFactory(new TestReactFactory('test'));

		label.setParent(new LinkModel({}));
		const widget = new LabelWidget({ engine, label, index });

		expect(label.getParent().getRenderedPath()).toMatchInlineSnapshot(`Array []`);
		expect(widget.findPathAndRelativePositionToRenderLabel(2)).toMatchInlineSnapshot(`undefined`);
	});
});
