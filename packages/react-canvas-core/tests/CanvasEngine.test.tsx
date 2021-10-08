import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import React from 'react';
import { CanvasEngine } from '../src/CanvasEngine';
import { CanvasModel } from '../src/entities/canvas/CanvasModel';
import { TestLayer, TestReactFactory } from './support/impls/TestLayer';

describe('CanvasEngine', () => {
	test.each([
		{
			name: 'Provide Options',
			options: {
				registerDefaultDeleteItemsAction: false,
				registerDefaultZoomCanvasAction: false,
				repaintDebounceMs: 10
			}
		},
		{
			name: 'Provide Default Options',
			options: {}
		},
		{
			name: 'Provide Undefined Options',
			options: undefined
		}
	])('constructor: $name', (tc) => {
		const engine = new CanvasEngine(tc.options);

		//TODO: typing does not all for it to be null
		expect(engine.getModel()).toBeNull();

		expect(engine.getActionEventBus()).toBeDefined();
		expect(engine.getStateMachine()).toBeDefined();
		expect(engine.getLayerFactories()).toBeDefined();
		expect(engine.getOptions()).toMatchSnapshot();
	});

	test('getter/setters', () => {
		const engine = new CanvasEngine();
		const { container, debug } = render(
			<div
				id="canvas"
				style={{
					padding: '20px',
					margin: '50px auto',
					whiteSpace: 'nowrap',
					width: '10px',
					height: '20px',
					overflow: 'hidden'
				}}>
				<div id="c" style={{ width: '100px', height: '200px', overflow: 'hidden' }}>
					Love is all you need
				</div>
			</div>
		);
		const canvas: HTMLDivElement = container.querySelector('#canvas');
		engine.setCanvas(canvas);
		expect(engine.getCanvas()).toEqual(canvas);

		engine.setModel(new CanvasModel());
		expect(engine.getModel()).toBeDefined();

		engine.setModel(null);
		expect(engine.getModel()).toBeNull();

		engine.setModel(new CanvasModel());

		engine.getModel().setOffset(10, 20);

		expect(engine.getRelativeMousePoint({ clientX: 50, clientY: 60 })).toMatchInlineSnapshot(`
		Point {
		  "x": 40,
		  "y": 40,
		}
	`);

		expect(() => engine.getFactoryForLayer('badlayer')).toThrowError();
		engine.getLayerFactories().registerFactory(new TestReactFactory('test'));
		expect(engine.getFactoryForLayer('test')).toBeDefined();
		expect(engine.getFactoryForLayer(new TestLayer())).toBeDefined();
		expect(engine.getMouseElement({} as any)).toBeNull();

		Object.defineProperty(HTMLElement.prototype, 'scrollWidth', { configurable: true, value: 500 });
		Object.defineProperty(HTMLElement.prototype, 'scrollHeight', { configurable: true, value: 500 });
		Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, value: 200 });
		Object.defineProperty(HTMLElement.prototype, 'clientHeight', { configurable: true, value: 200 });
		engine.zoomToFit();
		expect(engine.getModel().getOffsetX()).toEqual(0);
		expect(engine.getModel().getOffsetY()).toEqual(0);
		expect(engine.getModel().getZoomLevel()).toEqual(40);


		expect(engine.repaintCanvas(true)).toHaveProperty('then');
		expect(engine.repaintCanvas()).toBeUndefined();
	});
});
