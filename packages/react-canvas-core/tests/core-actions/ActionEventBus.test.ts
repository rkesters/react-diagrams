import { CanvasEngine } from '../../src/CanvasEngine';
import { Action, InputType } from '../../src/core-actions/Action';
import { ActionEventBus } from '../../src/core-actions/ActionEventBus';

describe('ActionEventBus', () => {
	test('Constructor', () => {
		const engine = new CanvasEngine();
		const bus = new ActionEventBus(engine);

		expect(bus.getKeys()).toMatchInlineSnapshot(`Array []`);
		expect(bus.getActionsForType(InputType.KEY_DOWN)).toMatchInlineSnapshot(`Array []`);
	});

	test('regestier action', () => {
		const engine = new CanvasEngine();
		const bus = new ActionEventBus(engine);

		const action: Action = new Action({
			type: InputType.KEY_DOWN,
			fire: jest.fn()
		});

		bus.registerAction(action);
		expect(bus.getKeys()).toMatchInlineSnapshot(`Array []`);
		expect(bus.getActionsForType(InputType.KEY_DOWN)).toBeDefined();
		expect(bus.getActionsForType(InputType.KEY_UP)).toMatchInlineSnapshot(`Array []`);
		expect(bus.getActionsForEvent({ event: { type: 'keydown', key: 'e' } } as any)).toBeDefined();
		expect(bus.getActionsForEvent({ event: { type: 'mouseup', key: 'e' } } as any)).toMatchInlineSnapshot(`Array []`);
		expect(bus.getActionsForEvent({ event: { type: 'mousedown', key: 'e' } } as any)).toMatchInlineSnapshot(`Array []`);
		expect(bus.getActionsForEvent({ event: { type: 'keyup', key: 'e' } } as any)).toMatchInlineSnapshot(`Array []`);
		expect(bus.getActionsForEvent({ event: { type: 'mousemove', key: 'e' } } as any)).toMatchInlineSnapshot(`Array []`);
		expect(bus.getActionsForEvent({ event: { type: 'wheel', key: 'e' } } as any)).toMatchInlineSnapshot(`Array []`);
		expect(bus.getActionsForEvent({ event: { type: 'touchstart', key: 'e' } } as any)).toMatchInlineSnapshot(
			`Array []`
		);
		expect(bus.getActionsForEvent({ event: { type: 'touchend', key: 'e' } } as any)).toMatchInlineSnapshot(`Array []`);
		expect(bus.getActionsForEvent({ event: { type: 'touchmove', key: 'e' } } as any)).toMatchInlineSnapshot(`Array []`);
		expect(bus.getActionsForEvent({ event: { type: 'invalid', key: 'e' } } as any)).toMatchInlineSnapshot(`Array []`);

		expect(bus.getModelForEvent({ type: 'keydown', key: 'e' } as any)).toMatchInlineSnapshot(`null`);

		bus.deregisterAction(action);
		expect(bus.getActionsForType(InputType.KEY_DOWN)).toMatchInlineSnapshot(`Array []`);
	});

	test('fire', () => {
		const engine = new CanvasEngine();
		const bus = new ActionEventBus(engine);

		const action: Action = new Action({
			type: InputType.KEY_DOWN,
			fire: jest.fn()
		});

		bus.registerAction(action);
		expect(bus.getKeys()).toMatchInlineSnapshot(`Array []`);
		expect(bus.getActionsForType(InputType.KEY_DOWN)).toBeDefined();

		bus.fireAction({ event: { type: 'keydown', key: 'e' } } as any);

		expect(action.options.fire).toHaveBeenCalled();
	});
});
