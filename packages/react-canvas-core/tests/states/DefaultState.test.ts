import { SyntheticEvent } from 'react';
import { CanvasEngine } from '../../src/CanvasEngine';
import { DefaultState } from '../../src/states/DefaultState';
import { DragCanvasState } from '../../src/states/DragCanvasState';
import { mocked } from 'ts-jest/utils';
import { BaseModel } from '../../src/core-models/BaseModel';

describe('DefaultState', () => {
	let engine = new CanvasEngine();
	beforeEach(() => {
		engine = new CanvasEngine();
	});

	test('Constructor', () => {
		const state = new DefaultState();

		expect(state.getOptions()).toMatchSnapshot();
	});

	test('Action Drag Start', () => {
		const state = new DefaultState();
		state.setEngine(engine);

		state.activated({} as any);
		state.transitionWithEvent = jest.fn();
		const event = { event: { type: 'mousedown' } as SyntheticEvent };
		engine.getActionEventBus().fireAction(event);

		expect(state.transitionWithEvent).toHaveBeenCalled();
		expect(mocked(state.transitionWithEvent).mock.calls[0][0].getOptions()).toMatchSnapshot();

	});

	test('Action Move', () => {
		const state = new DefaultState();
		state.setEngine(engine);

		state.activated({} as any);
		state.transitionWithEvent = jest.fn();

		const event = { model: new BaseModel({}), event: { type: 'mousedown' } as SyntheticEvent };
		engine.getActionEventBus().fireAction(event);

		expect(state.transitionWithEvent).toHaveBeenCalled();
		expect(mocked(state.transitionWithEvent).mock.calls[0][0].getOptions()).toMatchSnapshot();


	});

	test('Action Touch', () => {
		const state = new DefaultState();
		state.setEngine(engine);

		state.activated({} as any);
		state.transitionWithEvent = jest.fn();

		const event = { model: new BaseModel({}), event: { type: 'touchstart' } as SyntheticEvent };
		engine.getActionEventBus().fireAction(event);

		expect(state.transitionWithEvent).toHaveBeenCalled();
		expect(mocked(state.transitionWithEvent).mock.calls[0][0].getOptions()).toMatchSnapshot();


	});
});
