import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import React from 'react';
import { CanvasEngine } from '../../../src/CanvasEngine';
import { CanvasModel } from '../../../src/entities/canvas/CanvasModel';
import { TransformLayerWidget } from '../../../src/entities/layer/TransformLayerWidget';
import { TestLayer, TestReactFactory } from '../../support/impls/TestLayer';



describe('TransformLayerWidget', () => {
	test('Constructor', async () => {
		const engine = new CanvasEngine();
		engine.getLayerFactories().registerFactory(new TestReactFactory('test'));
		const result = render(<TransformLayerWidget layer={new TestLayer()} > <div id="child" /> </TransformLayerWidget>);
		expect(result.container.querySelector('.css-12q0bj3')).not.toBeNull();
		expect(result.container.querySelector('#child')).not.toBeNull();
		const svg = render(<TransformLayerWidget layer={new TestLayer({isSvg: true})} />);
		expect(svg.container.querySelector('svg')).not.toBeNull();

	});
	test('getTransformStyle', async () => {
		const engine = new CanvasEngine();
		engine.getLayerFactories().registerFactory(new TestReactFactory('test'));

		const layer = new TestLayer();
		const widget = new TransformLayerWidget({ layer });
		layer.setParent(new CanvasModel());

		expect(widget.getTransformStyle()).toMatchSnapshot();
		layer.getOptions().transformed = true;
		expect(widget.getTransformStyle()).toMatchSnapshot();

		layer.getParent().setOffsetX(10);
		expect(widget.getTransformStyle()).toMatchSnapshot();
		layer.getParent().setOffsetY(20);
		expect(widget.getTransformStyle()).toMatchSnapshot();
	});

});
