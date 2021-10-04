import { DeleteItemsAction, DeleteItemsActionOptions } from '../../src/actions/DeleteItemsAction';
import { CanvasEngine, CanvasEngineOptions } from '../../src/CanvasEngine';
import { ActionEvent } from '../../src/core-actions/Action';
import { mocked } from 'ts-jest/utils';
import { SyntheticEvent, KeyboardEvent } from 'react';
import { createEvent } from '@testing-library/react';
import { MockedObjectDeep } from 'ts-jest/dist/utils/testing';
import { BaseEntity } from '../../src/core-models/BaseEntity';
import { CanvasModelGenerics } from '../../src/entities/canvas/CanvasModel';

jest.mock('../../src/CanvasEngine');

const MockEngine = mocked(CanvasEngine, true);

const generateKeyboardEvent = (options: DeleteItemsActionOptions, index: number): ActionEvent<KeyboardEvent> => {
	const event = {
		...options.modifiers,
		key: options.keys[index],
		keyCode: options.keyCodes[index]
	};
	return { event } as ActionEvent<KeyboardEvent>;
};

interface TestCases {
	options?: DeleteItemsActionOptions;
	name: string;
	index: number;
}

describe('DeleteItemsAction', () => {
	let engine = new CanvasEngine();
	let mockEngine = mocked(engine);
	beforeEach( () => {
		mockEngine.getModel.mockReturnValue( {isLocked: jest.fn().mockReturnValue(false)}  as any)
	})



	test.each<TestCases>([
		{
			name: '10NoModifiers',
			options: {
				keyCodes: [69],
				keys: ['e'],
				modifiers: {
					ctrlKey: false,
					shiftKey: false,
					altKey: false,
					metaKey: false
				}
			},
			index: 0
		},

		{
			name: 'Undefined Options',
			options: undefined,
			index: 0
		}
	])('Constructor', (tc) => {
		const action: DeleteItemsAction = new DeleteItemsAction(tc.options);
		action.setEngine(engine);

		expect(action.options).toMatchSnapshot();

		const event = generateKeyboardEvent(tc.options, tc.index);

		action.options.fire(event);
	});
});
