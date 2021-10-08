import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import React from 'react';
import { CanvasEngine } from '../../../src/CanvasEngine';
import { SmartLayerWidget } from '../../../src/entities/layer/SmartLayerWidget';
import { TestLayer, TestReactFactory } from '../../support/impls/TestLayer';


describe('SmartLayerWidget', () => {
	test('Constructor', async () => {
		const engine = new CanvasEngine();
		engine.getLayerFactories().registerFactory(new TestReactFactory('test'));
		const result = 	render(<SmartLayerWidget engine={engine} layer={new TestLayer()} />);
		expect(result.container.querySelector('#factory')).not.toBeNull();

		const layer = new TestLayer();
		const widget = new SmartLayerWidget({engine, layer });

		expect(widget.shouldComponentUpdate()).toEqual(true);
		layer.allowRepaint(false);
		expect(widget.shouldComponentUpdate()).toEqual(false);

	});
});
