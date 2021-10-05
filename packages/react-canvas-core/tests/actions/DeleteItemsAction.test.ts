import { defaults } from 'lodash';
import { KeyboardEvent } from 'react';
import { mocked } from 'ts-jest/utils';
import { DeleteItemsAction, DeleteItemsActionOptions } from '../../src/actions/DeleteItemsAction';
import { CanvasEngine } from '../../src/CanvasEngine';
import { ActionEvent } from '../../src/core-actions/Action';

jest.mock('../../src/CanvasEngine');

const generateKeyboardEvent = (
	opts: DeleteItemsActionOptions | undefined,
	index: number
): ActionEvent<KeyboardEvent> => {
	const modifiers = {
		ctrlKey: false,
		shiftKey: false,
		altKey: false,
		metaKey: false,
		...(opts.modifiers ?? {})
	};
	const options: DeleteItemsActionOptions = opts ?? {
		keyCodes: [46, 8],
		keys: ['Backspace', 'Delete']
	};
	const event = {
		key: options.keys?.[index] ?? undefined,
		keyCode: options.keyCodes?.[index] ?? undefined,
		...modifiers
	};
	return { event } as ActionEvent<KeyboardEvent>;
};

interface TestCases {
	options?: DeleteItemsActionOptions;
	name: string;
	index: number;
}

const createMockEngine = (islocked: boolean)=> {
	const engine = new CanvasEngine();
	const mockEngine = mocked(engine);
	const models = [{ remove: jest.fn(), isLocked: jest.fn().mockImplementation(() => islocked) }];
	const mockCModlel: any = {
		getSelectedEntities: jest.fn().mockImplementation(() => models)
	};
	mockEngine.getModel.mockImplementation(() => {
		return mockCModlel;
	});
	return mockEngine;
}

const testcases: TestCases[] = [
	{
		name: 'Deprecaed keyCodes only',
		options: {
			keyCodes: [69],
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
		name: '1 allowed character',
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
		name: '2 Allowed characters',
		options: {
			keyCodes: [69, 70],
			keys: ['e', 'f'],
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
		name: '2 Allowed characters with ctrlKey',
		options: {
			keyCodes: [69, 70],
			keys: ['e', 'f'],
			modifiers: {
				ctrlKey: true,
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
];

describe('DeleteItemsAction', () => {
	test.each<TestCases>(testcases)('Constructor: $name', (tc) => {
		const action: DeleteItemsAction = new DeleteItemsAction(tc.options);
		expect(action.deleteOptions).toMatchSnapshot();
	});

	describe('Fire Event', () => {

		describe('Model is not locked', () => {

			test.each<TestCases>(testcases)('Send Correct Keys: $name', (tc) => {
				const engine = createMockEngine(false);
				const action: DeleteItemsAction = new DeleteItemsAction(tc.options);
				action.setEngine(engine);

				const event = generateKeyboardEvent(defaults(tc.options, { keys: ['Backspace', 'Delete'] }), tc.index);

				expect(event).toMatchSnapshot();
				action.options.fire(event);

				expect(engine.getModel).toHaveBeenCalled();
				expect(engine.getModel().getSelectedEntities).toMatchSnapshot();
				expect(engine.getModel().getSelectedEntities()[0].isLocked).toHaveBeenCalled();
				expect(engine.getModel().getSelectedEntities()[0].remove).toHaveBeenCalled();
			});
		});
		describe('Model is locked', () => {

			test.each<TestCases>(testcases)('Send Correct Keys: $name', (tc) => {
				const engine = createMockEngine(true);
				const action: DeleteItemsAction = new DeleteItemsAction(tc.options);
				action.setEngine(engine);

				const event = generateKeyboardEvent(defaults(tc.options, { keys: ['Backspace', 'Delete'] }), tc.index);

				expect(event).toMatchSnapshot();
				action.options.fire(event);

				expect(engine.getModel).toHaveBeenCalled();
				expect(engine.getModel().getSelectedEntities).toMatchSnapshot();
				expect(engine.getModel().getSelectedEntities()[0].isLocked).toHaveBeenCalled();
				expect(engine.getModel().getSelectedEntities()[0].remove).not.toHaveBeenCalled();
			});
		});
	});
});
