import { mocked } from 'ts-jest/utils';
import { CanvasEngine } from '../../src/CanvasEngine';
import { CanvasModel } from '../../src/entities/canvas/CanvasModel';
import { DragCanvasState } from '../../src/states/DragCanvasState';
import { TestLayer } from '../support/impls/TestLayer';



describe('DragCanvasState', () => {
	let engine = new CanvasEngine();
	beforeEach(() => {
		engine = new CanvasEngine();
		engine.setModel(new CanvasModel());
	});

	test('Constructor', () => {
		const state = new DragCanvasState();

		expect(state.getOptions()).toMatchSnapshot();
	});

	test('Activate', async () => {
		const state = new DragCanvasState();
		state.setEngine(engine);
		engine.getModel().setOffset(10, 20);
		const layer = new TestLayer();
		engine.getModel().addLayer(layer);
		engine.repaintCanvas = jest.fn();

		layer.allowRepaint = jest.fn();
		await state.activated({} as any);
		expect(state.initialCanvasX).toEqual(10);
		expect(state.initialCanvasY).toEqual(20);
		expect(layer.allowRepaint).toHaveBeenCalledWith(false);

		state.deactivated({} as any);
		expect(layer.allowRepaint).toHaveBeenCalledWith(true);

	});

	test('Fire Mouse Event', async () => {
		const state = new DragCanvasState();
		state.setEngine(engine);
		engine.getModel().setOffset(10, 20);
		const layer = new TestLayer();
		engine.getModel().addLayer(layer);
		engine.repaintCanvas = jest.fn();

		state.fireMouseMoved({displacementX: 30,displacementY: 50} as any);
		expect(engine.getModel().getOffsetX()).toEqual(state.initialCanvasX + 30);
		expect(engine.getModel().getOffsetY()).toEqual(state.initialCanvasY + 50);
		expect(engine.repaintCanvas).toHaveBeenCalled();

		state.config.allowDrag = false;
		mocked(engine.repaintCanvas).mockClear();
		state.fireMouseMoved({displacementX: 30,displacementY: 50} as any);

		expect(engine.repaintCanvas).not.toHaveBeenCalled();

	});

});
