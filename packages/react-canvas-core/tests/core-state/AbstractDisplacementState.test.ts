import { CanvasEngine } from '../../src/CanvasEngine';
import {
	AbstractDisplacementState,
	AbstractDisplacementStateEvent
} from '../../src/core-state/AbstractDisplacementState';
import { CanvasModel } from '../../src/entities/canvas/CanvasModel';

class TestState extends AbstractDisplacementState {
	mockFireMouseMoved = jest.fn();
	mockhandleMoveStart = jest.fn();
	mockhandleMoveEnd = jest.fn();
	mockhandleMove = jest.fn();

	fireMouseMoved(event: AbstractDisplacementStateEvent) {
		this.mockFireMouseMoved(event);
	}

	protected handleMoveStart(x: number, y: number): void {
		super.handleMoveStart(x, y);
		this.mockhandleMoveStart();
	}

	protected handleMoveEnd(): void {
		//TODO: handleMoveEnd does not handle null
		//super.handleMoveEnd();
		this.mockhandleMoveEnd();
	}
	protected handleMove(x: number, y: number, event: React.MouseEvent | React.TouchEvent) {
		super.handleMove(x, y, event);
		this.mockhandleMove(x, y, event);
	}
}

describe('AbstractDisplacementState', () => {
	test('constructor', () => {
		const state = new TestState({ name: 'TestDisplacementState' });

		expect(state.getOptions()).toEqual({ name: 'TestDisplacementState' });
	});

	test('handleMoveStart', () => {
		const state = new TestState({ name: 'TestDisplacementState' });
		const engine = new CanvasEngine();
		const model = new CanvasModel();

		const canvas: any = {
			getBoundingClientRect: jest.fn().mockImplementation(() => {
				return {
					left: 0,
					top: 100
				};
			})
		};

		engine.setModel(model);
		engine.setCanvas(canvas);
		state.setEngine(engine);
		state.activated(state);
		const actions = engine.getActionEventBus().getActionsForEvent({ event: { type: 'mousedown', key: 'k' } } as any);

		expect(actions.length).toMatchInlineSnapshot(`1`);

		engine.getActionEventBus().fireAction({ event: { type: 'mousedown', clientX: 0, clientY: 0 } } as any);

		expect(state.mockhandleMoveStart).toHaveBeenCalled();

		engine.getActionEventBus().fireAction({ event: { type: 'mousemove', clientX: 20, clientY: 30 } } as any);
		expect(state.mockhandleMove).toHaveBeenCalled();
		expect(state.mockFireMouseMoved).toHaveBeenCalled();

		expect(state.mockhandleMove.mock.calls[0]).toMatchInlineSnapshot(`
		Array [
		  20,
		  30,
		  Object {
		    "clientX": 20,
		    "clientY": 30,
		    "type": "mousemove",
		  },
		]
	`);

		expect(state.mockFireMouseMoved.mock.calls[0]).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "displacementX": 20,
		    "displacementY": 30,
		    "event": Object {
		      "clientX": 20,
		      "clientY": 30,
		      "type": "mousemove",
		    },
		    "virtualDisplacementX": 20,
		    "virtualDisplacementY": 30,
		  },
		]
	`);

		expect(state.initialX).toMatchInlineSnapshot(`0`);
		expect(state.initialY).toMatchInlineSnapshot(`0`);
		expect(state.initialXRelative).toMatchInlineSnapshot(`0`);
		expect(state.initialYRelative).toMatchInlineSnapshot(`-100`);

		engine.getActionEventBus().fireAction({ event: { type: 'mouseup'} } as any);
		expect(state.mockhandleMoveEnd).toHaveBeenCalled();
	});


});
