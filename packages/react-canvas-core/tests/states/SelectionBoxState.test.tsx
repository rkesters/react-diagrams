import { mocked } from 'ts-jest/utils';
import { CanvasEngine } from '../../src/CanvasEngine';
import { CanvasModel } from '../../src/entities/canvas/CanvasModel';
import { SelectionBoxState } from '../../src/states/SelectionBoxState';
import { TestLayer } from '../support/impls/TestLayer';
import React, { SyntheticEvent } from 'react';
import { cleanup, render } from '@testing-library/react';
import { BaseModel } from '../../src/core-models/BaseModel';
import { BasePositionModel } from '../../src/core-models/BasePositionModel';
import { Point, Rectangle } from '@projectstorm/geometry';
import { has } from 'lodash';

describe('SelectionBoxState', () => {
	let engine = new CanvasEngine();
	let entities: [BasePositionModel, BasePositionModel, BasePositionModel, BaseModel] = [
		new BasePositionModel({}),
		new BasePositionModel({ locked: true }),
		new BasePositionModel({ locked: false }),
		new BaseModel({})
	];
	beforeEach(() => {
		engine = new CanvasEngine();
		engine.setModel(new CanvasModel());
		const addLayer = engine.getModel().addLayer;
		engine.repaintCanvas = jest.fn();
		engine.getModel().addLayer = jest.fn().mockImplementation(addLayer.bind(engine.getModel()));

		render(<div className="canvas"></div>);
		const canvas: HTMLDivElement = document.querySelector('.canvas');
		engine.setCanvas(canvas);
		entities = [
			new BasePositionModel({}),
			new BasePositionModel({ locked: true }),
			new BasePositionModel({ locked: false }),
			new BaseModel({})
		];
		engine.getModel().getSelectedEntities = jest.fn().mockImplementation(() => entities);
		engine.getModel().getSelectionEntities = jest.fn().mockImplementation(() => entities);
		engine.getRelativeMousePoint = jest.fn().mockImplementation(engine.getRelativeMousePoint);
		entities.forEach((e) =>
			has(e, 'getBoundingBox')
				? ((e as any).getBoundingBox = jest.fn().mockImplementation((e as any).getBoundingBox))
				: undefined
		);
		entities.forEach((e) => (e.setSelected = jest.fn().mockImplementation(e.setSelected)));
		entities[0].setPosition(new Point(100, 100));
		entities[2].setPosition(new Point(-15, -25));
	});

	test('Constructor', () => {
		const state = new SelectionBoxState();

		expect(state.getOptions()).toMatchSnapshot();
	});

	test('Activate', async () => {
		const state = new SelectionBoxState();
		const mockedRepaintCanvas = mocked(engine.repaintCanvas);
		const mockedAddLayer = mocked(engine.getModel().addLayer);

		state.setEngine(engine);
		engine.getModel().setOffset(10, 20);
		const layer = new TestLayer();

		engine.repaintCanvas = jest.fn();

		layer.allowRepaint = jest.fn();
		await state.activated({} as any);

		expect(mockedAddLayer).toHaveBeenCalled();
		expect(state.layer).toBeDefined();

		const remove = state.layer.remove;
		state.layer.remove = jest.fn().mockImplementation(remove);
		const mockedRemove = mocked(state.layer.remove);

		mockedRepaintCanvas.mockClear();
		state.deactivated({} as any);
		expect(mockedRemove).toHaveBeenCalled();
		expect(engine.repaintCanvas).toHaveBeenCalled();
	});

	test('Fire Mouse Event', async () => {
		const state = new SelectionBoxState();
		state.setEngine(engine);
		engine.getModel().setOffset(10, 20);
		await state.activated({} as any);

		state.layer.setBox = jest.fn().mockImplementation(state.layer.setBox);
		const event = { virtualDisplacementX: 30, virtualDisplacementY: 50, event: { clientX: 0, clientY: 0 } } as any;

		state.initialX = 0;
		state.initialY = 0;

		state.fireMouseMoved(event);
		expect(engine.repaintCanvas).toHaveBeenCalled();
		expect(state.layer.setBox).toHaveBeenCalledWith(state.getBoxDimensions(event));
		expect(entities[0].setSelected).toHaveBeenCalledWith(false);
		expect(entities[1].setSelected).toHaveBeenCalledWith(true);
		expect(entities[2].setSelected).toHaveBeenCalledWith(false);
	});

	test('Fire Mouse Event with negitive dispalcement', async () => {
		const state = new SelectionBoxState();
		state.setEngine(engine);
		engine.getModel().setOffset(10, 20);
		await state.activated({} as any);

		state.layer.setBox = jest.fn().mockImplementation(state.layer.setBox);
		const event = { virtualDisplacementX: -30, virtualDisplacementY: -50, event: { clientX: 0, clientY: 0 } } as any;

		state.initialX = 0;
		state.initialY = 0;

		state.fireMouseMoved(event);
		expect(engine.repaintCanvas).toHaveBeenCalled();
		expect(state.layer.setBox).toHaveBeenCalledWith(state.getBoxDimensions(event));
		expect(entities[0].setSelected).toHaveBeenCalledWith(false);
		expect(entities[1].setSelected).toHaveBeenCalledWith(false);
		expect(entities[2].setSelected).toHaveBeenCalledWith(true);
	});

	test.each([
		{
			initialXRelative: 0,
			initialYRelative: 0,
			clientX: 30,
			clientY: 20
		},
		{
			initialXRelative: 100,
			initialYRelative: 120,
			clientX: 30,
			clientY: 20
		},
		{
			initialXRelative: 100,
			initialYRelative: 120,
			clientX: 30,
			clientY: 20,
			touches: true
		}
	])('getBoxDimensions', async (tc) => {
		const state = new SelectionBoxState();
		state.setEngine(engine);
		engine.getModel().setOffset(10, 20);
		state.initialXRelative = tc.initialXRelative;
		state.initialYRelative = tc.initialYRelative;
		state.initialX = 0;
		state.initialY = 0;
		const event = {
			virtualDisplacementX: -30,
			virtualDisplacementY: -50,
			event: { clientX: tc.clientX, clientY: tc.clientY, touches: [{ clientX: tc.clientX, clientY: tc.clientY }] }
		} as any;
		if (!tc.touches) {
			delete event.event.touches;
		}

		expect(state.getBoxDimensions(event)).toMatchSnapshot();
	});
});
