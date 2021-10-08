import '@testing-library/jest-dom';
import { cleanup, render } from '@testing-library/react';
import React, { SyntheticEvent } from 'react';
import { mocked } from 'ts-jest/utils';
import { CanvasEngine } from '../../src/CanvasEngine';
import { BaseModel } from '../../src/core-models/BaseModel';
import { CanvasModel } from '../../src/entities/canvas/CanvasModel';
import { DefaultState } from '../../src/states/DefaultState';
import { SelectingState } from '../../src/states/SelectingState';

describe('SelectingState', () => {
	let engine = new CanvasEngine();
	let eventModel = new BaseModel({});
	let mouseDownEvent: any = { event: { type: 'mousedown' } as SyntheticEvent };
	beforeEach(() => {
		engine = new CanvasEngine();
		engine.setModel(new CanvasModel());
		render(<div className="canvas"></div>);
		const canvas: HTMLDivElement = document.querySelector('.canvas');
		engine.setCanvas(canvas);

		eventModel = new BaseModel({});
		eventModel.isSelected = jest.fn().mockImplementation(() => false);
		engine.getModel().clearSelection = jest.fn();
		engine.repaintCanvas = jest.fn();
		mouseDownEvent = { ...mouseDownEvent, model: eventModel } as any;
		engine.getStateMachine().pushState(new DefaultState());
	});

	afterEach(cleanup);

	test('Constructor', () => {
		const state = new SelectingState();

		expect(state.getOptions()).toMatchSnapshot();
	});

	test('Action mousedown with model ', () => {
		const state = new SelectingState();
		const mockedRepaintCanvas = mocked(engine.repaintCanvas);
		state.setEngine(engine);
		engine.getActionEventBus().getActionsForEvent({ event: { type: 'keydown', key: 'shift' } } as any);
		engine.getStateMachine().pushState(state);
		state.transitionWithEvent = jest.fn();
		eventModel.getOptions().selected = false;

		state.activated({} as any);

		engine.getActionEventBus().fireAction(mouseDownEvent);
		expect(state.transitionWithEvent).not.toHaveBeenCalled();
		expect(mockedRepaintCanvas).toHaveBeenCalled();
		expect(eventModel.getOptions().selected).toEqual(true);
	});

	test('Action mousedown without model', () => {
		const state = new SelectingState();
		const mockedRepaintCanvas = mocked(engine.repaintCanvas);

		state.setEngine(engine);
		engine.getActionEventBus().getActionsForEvent({ event: { type: 'keydown', key: 'shift' } } as any);
		engine.getStateMachine().pushState(state);
		state.transitionWithEvent = jest.fn();
		eventModel.getOptions().selected = false;
		state.activated({} as any);

		engine.getActionEventBus().fireAction({ ...mouseDownEvent, model: undefined });
		expect(state.transitionWithEvent).toHaveBeenCalled();
		expect(mockedRepaintCanvas).not.toHaveBeenCalled();
		expect(eventModel.getOptions().selected).not.toEqual(true);
	});
});
