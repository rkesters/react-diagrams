import { CanvasEngine } from "../../src/CanvasEngine";
import { State, StateOptions} from "../../src/core-state/State";


class TestState extends State {

	constructor( options: StateOptions, keys?: string[], childern?: State[]) {
		super(options)
		this.keys = keys ?? [];
		this.childStates = childern ?? [];
	}

	get Keys() { return this.keys};
	get ChildStates() { return this.childStates};

}

describe('State', () => {


	test('constructor', () => {

		const state = new TestState({name: 'GOD'});

		expect(state.getOptions()).toEqual({name: 'GOD'});

		const engine = new CanvasEngine();

		state.setEngine(engine);

		state.transitionWithEvent(state, {event: {type: 'mousedown'}} as any)

		const current = engine.getStateMachine().getCurrentState();
		expect(current).toEqual(state);

		//state.eject();

	})

	test('keys', () => {
		const state = new TestState({name: 'KEYS'}, ['k', 'e','y']);

		expect( state.isKeysFullfilled(['k'])).toBeFalsy()
		expect( state.isKeysFullfilled(['k', 'e','y'])).toBeTruthy();
		expect( state.isKeysFullfilled(['k', 'e','y', 's'])).toBeTruthy();
		expect( state.isKeysFullfilled(['k', 'e','s', 'y'])).toBeTruthy();
	})

	test('transitionWithEvent', () => {
		const state = new TestState({name: 'KEYS'}, ['k']);
		const state2 = new TestState({name: 'GOD'}, ['g']);

		const engine = new CanvasEngine();

		state.setEngine(engine);
		engine.getActionEventBus().getActionsForEvent({event: {type: 'keydown', key: 'k'}} as any)

		state.transitionWithEvent(state, {event: {type: 'keydown', key: 'k'}} as any)
		state.transitionWithEvent(state2, {event: {type: 'keydown', key: 'g'}} as any)
	})

	test('child states', () => {
		const state2 = new TestState({name: 'GOD'}, ['g']);
		const state = new TestState({name: 'KEYS'}, ['k'], [state2]);


		const engine = new CanvasEngine();

		state.setEngine(engine);
		engine.getActionEventBus().getActionsForEvent({event: {type: 'keydown', key: 'k'}} as any)

		state.transitionWithEvent(state, {event: {type: 'keydown', key: 'k'}} as any)
		state.transitionWithEvent(state2, {event: {type: 'keydown', key: 'g'}} as any)
	})
} )