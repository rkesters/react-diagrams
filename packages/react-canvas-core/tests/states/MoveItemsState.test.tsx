import { SyntheticEvent } from 'react';
import { mocked } from 'ts-jest/utils';
import { CanvasEngine } from '../../src/CanvasEngine';
import { CanvasModel } from '../../src/entities/canvas/CanvasModel';
import { DragCanvasState } from '../../src/states/DragCanvasState';
import { MoveItemsState } from '../../src/states/MoveItemsState';
import { TestLayer } from '../support/impls/TestLayer';
import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BaseModel } from '../../src/core-models/BaseModel';
import { after } from 'lodash';
import { BasePositionModel } from '../../src/core-models/BasePositionModel';
import { Point } from '@projectstorm/geometry';

describe('MoveItemsState', () => {
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
	});

	afterEach(cleanup);

	test('Constructor', () => {
		const state = new MoveItemsState();

		expect(state.getOptions()).toMatchSnapshot();
	});

	test('Action mousedown without selection', () => {
		const state = new MoveItemsState();
		state.setEngine(engine);

		state.activated({} as any);
		const mockedIsSelected = mocked(eventModel.isSelected);
		const mockedClearSelection = mocked(engine.getModel().clearSelection);
		const mockedRepaintCanvas = mocked(engine.repaintCanvas);

		engine.getActionEventBus().fireAction(mouseDownEvent);
		expect(mockedIsSelected).toHaveBeenCalled();
		expect(mockedClearSelection).toHaveBeenCalled();
		expect(mockedRepaintCanvas).toHaveBeenCalled();
		expect(eventModel.getOptions().selected).toEqual(true);
	});

	test('Action mousedown with selection', () => {
		const state = new MoveItemsState();
		state.setEngine(engine);

		state.activated({} as any);
		const mockedIsSelected = mocked(eventModel.isSelected);
		const mockedClearSelection = mocked(engine.getModel().clearSelection);
		const mockedRepaintCanvas = mocked(engine.repaintCanvas);
		mockedIsSelected.mockImplementation(() => true);

		engine.getActionEventBus().fireAction(mouseDownEvent);
		expect(mockedIsSelected).toHaveBeenCalled();
		expect(mockedClearSelection).not.toHaveBeenCalled();
		expect(mockedRepaintCanvas).toHaveBeenCalled();
		expect(eventModel.getOptions().selected).toEqual(true);
	});

	test('Action mousedown without model', () => {
		const state = new MoveItemsState();
		state.setEngine(engine);

		state.activated({} as any);
		const mockedIsSelected = mocked(eventModel.isSelected);
		const mockedClearSelection = mocked(engine.getModel().clearSelection);
		const mockedRepaintCanvas = mocked(engine.repaintCanvas);

		engine.getActionEventBus().fireAction({ ...mouseDownEvent, model: undefined });
		expect(mockedIsSelected).not.toHaveBeenCalled();
		expect(mockedClearSelection).not.toHaveBeenCalled();
		expect(mockedRepaintCanvas).not.toHaveBeenCalled();
		expect(eventModel.getOptions().selected).not.toEqual(true);
	});

	test('Fire Mouse Event', async () => {
		const state = new MoveItemsState();
		state.setEngine(engine);
		engine.getModel().setOffset(10, 20);
		const layer = new TestLayer();
		engine.getModel().addLayer(layer);

		const entities: [BasePositionModel, BasePositionModel, BasePositionModel, BaseModel] = [
			new BasePositionModel({}),
			new BasePositionModel({ locked: true }),
			new BasePositionModel({ locked: false }),
			new BaseModel({})
		];
		engine.getModel().getSelectedEntities = jest.fn().mockImplementation(() => entities);

		state.initialPositions = { [entities[0].getID()]: { point: new Point(0, 0), item: entities[0] } };
		state.fireMouseMoved({ virtualDisplacementX: 30, virtualDisplacementY: 50 } as any);

		expect(entities[0].getPosition()).toMatchInlineSnapshot(`
		Point {
		  "x": 30,
		  "y": 50,
		}
	`);
		expect(Object.keys(state.initialPositions)).toEqual([entities[0].getID(), entities[2].getID()]);
	});
});
