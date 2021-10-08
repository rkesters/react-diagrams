import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { CanvasEngine, CanvasEngineListener } from '../../src/CanvasEngine';
import { BaseModel, BaseModelGenerics } from '../../src/core-models/BaseModel';
import { AbstractModelFactory, GenerateModelEvent } from '../../src/core/AbstractModelFactory';
import { AbstractReactFactory, GenerateWidgetEvent } from '../../src/core/AbstractReactFactory';
import { FactoryBank, FactoryBankListener } from '../../src/core/FactoryBank';
import { CanvasModel, CanvasModelGenerics } from '../../src/entities/canvas/CanvasModel';
import { CanvasWidget } from '../../src/entities/canvas/CanvasWidget';
import { LayerModel, LayerModelGenerics } from '../../src/entities/layer/LayerModel';
import mockConsole from 'jest-mock-console';
import { Action, InputType } from '../../src/core-actions/Action';

import { PeformanceWidget } from '../../src/widgets/PeformanceWidget';

class NoPerformanceTune extends BaseModel {
	performanceTune() {
		return false;
	}
}
describe('PeformanceWidget', () => {
	test('render', () => {
		const { container } = render(
			<PeformanceWidget serialized={{}} model={new BaseModel({})} children={() => <div id={'child'}></div>} />
		);

		expect(container.querySelector('#child')).not.toBeNull();
	});

	test('shouldComponentUpdate - performanceTune true', () => {
		const widget = new PeformanceWidget({
			children: jest.fn().mockImplementation(() => <div></div>),
			serialized: {},
			model: new NoPerformanceTune({})
		});

		expect(
			widget.shouldComponentUpdate(
				{
					children: jest.fn().mockImplementation(() => <div></div>),
					serialized: {},
					model: new NoPerformanceTune({})
				},
				{},
				{}
			)
		).toEqual(true);
	});
	test('shouldComponentUpdate - models do not equal', () => {
		const widget = new PeformanceWidget({
			children: jest.fn().mockImplementation(() => <div></div>),
			serialized: {},
			model: new BaseModel({})
		});

		expect(
			widget.shouldComponentUpdate(
				{
					children: jest.fn().mockImplementation(() => <div></div>),
					serialized: {},
					model: new BaseModel({})
				},
				{},
				{}
			)
		).toEqual(true);
	});

	test('shouldComponentUpdate - models do equal with different serialized', () => {
		const model = new BaseModel({});
		const widget = new PeformanceWidget({
			children: jest.fn().mockImplementation(() => <div></div>),
			serialized: { id: 1 },
			model
		});

		expect(
			widget.shouldComponentUpdate(
				{
					children: jest.fn().mockImplementation(() => <div></div>),
					serialized: { id: 2 },
					model
				},
				{},
				{}
			)
		).toEqual(true);
	});

	test('shouldComponentUpdate - models do equal with same serialized', () => {
		const model = new BaseModel({});
		const serialized = { id: 1 };
		const widget = new PeformanceWidget({
			children: jest.fn().mockImplementation(() => <div></div>),
			serialized,
			model
		});

		expect(
			widget.shouldComponentUpdate(
				{
					children: jest.fn().mockImplementation(() => <div></div>),
					serialized,
					model
				},
				{},
				{}
			)
		).toEqual(false);
	});
});
