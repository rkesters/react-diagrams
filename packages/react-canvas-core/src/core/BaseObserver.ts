import { has, isNil } from 'lodash';
import { Toolkit } from '../Toolkit';

import debug from 'debug';

const dbg = debug('reactDiagrams:canvasCore:BaseObserver');
export interface BaseEvent {
	firing: boolean;
	stopPropagation: () => any;
}

export interface BaseEventProxy extends BaseEvent {
	function: string;
}

/**
 * Listeners are always in the form of an object that contains methods that take events
 */
export type BaseListener = {
	/**
	 * Generic event that fires before a specific event was fired
	 */
	eventWillFire?: (event: BaseEvent & { function: string }) => void;

	/**
	 * Generic event that fires after a specific event was fired (even if it was consumed)
	 */
	eventDidFire?: (event: BaseEvent & { function: string }) => void;
	/**
	 * Type for other events that will fire
	 */
	[key: string]: (event: BaseEvent) => any;
};

export interface ListenerHandle {
	/**
	 * Used to degister the listener
	 */
	deregister: () => any;
	/**
	 * Original ID of the listener
	 */
	id: string;

	/**
	 * Original Listener
	 */
	listener: BaseListener;
}

export function isaListenerHandle(value: unknown): value is ListenerHandle {
	return has(value, 'id') && has(value, 'deregister') && has(value, 'listener');
}

/**
 * Base observer pattern class for working with listeners
 */
export class BaseObserver<L extends BaseListener = BaseListener> {
	protected listeners: { [id: string]: L };

	constructor() {
		this.listeners = {};
	}

	private fireEventInternal(fire: boolean, k: keyof L, event: BaseEvent) {
		dbg(`fireEventInternal ${k} ${fire}`);
		this.iterateListeners((listener) => {
			dbg(`iterateListeners ${k} ${fire}`);
			// returning false here will instruct itteration to stop
			if (!fire && !event.firing) {
				dbg(`iterateListeners ${k} will not fire ${fire} ${event.firing}`);

				return false;
			}

			dbg(`iterateListeners ${k} ${isNil(listener[k])}`);
			// fire selected listener
			if (listener[k]) {
				listener[k](event as BaseEvent);
			}
		});
	}

	fireEvent<K extends keyof L>(event: Partial<Parameters<L[K]>[0]>, k: keyof L) {
		dbg(`fireEvent ${k}`);
		event = {
			firing: true,
			stopPropagation: () => {
				event.firing = false;
			},
			...event
		};

		// fire pre
		this.fireEventInternal(true, 'eventWillFire', {
			...event,
			function: k
		} as BaseEventProxy);

		dbg(`fireEvent ${k} Main`);
		// fire main event
		this.fireEventInternal(false, k, event as BaseEvent);
		dbg(`fireEvent ${k} post`);
		// fire post
		this.fireEventInternal(true, 'eventDidFire', {
			...event,
			function: k
		} as BaseEventProxy);
	}

	iterateListeners(cb: (listener: L) => any) {
		dbg(`iterateListeners (${Object.keys(this.listeners ?? {}).join(',')})`);
		for (let id in this.listeners) {
			const res = cb(this.listeners[id]);
			// cancel itteration on false
			if (res === false) {
				return;
			}
		}
	}

	getListenerHandle(listener: L): ListenerHandle {
		for (let id in this.listeners) {
			if (this.listeners[id] === listener) {
				return {
					id: id,
					listener: listener,
					deregister: () => {
						delete this.listeners[id];
					}
				};
			}
		}
	}

	registerListener(listener: L): ListenerHandle {
		const id = Toolkit.UID();
		this.listeners[id] = listener;
		const modelID = (this as any).getID ? (this as any).getID() : 'no id';
		dbg(`registerListener on ${modelID} : (${Object.keys(this.listeners ?? {}).join(',')}) (${Object.keys(listener ?? {}).join(',')})`);
		return {
			id: id,
			listener: listener,
			deregister: () => {
			dbg(`deregister on ${modelID} (${Object.keys(this.listeners ?? {}).join(',')}) (${Object.keys(listener ?? {}).join(',')})`);
				delete this.listeners[id];
			}
		};
	}

	deregisterListener(listener: L | ListenerHandle) {
		if (isaListenerHandle(listener)) {
			(listener as ListenerHandle).deregister();
			return true;
		}
		const handle = this.getListenerHandle(listener);
		if (handle) {
			dbg(`deregisterListener (${handle.id})`);

			handle.deregister();
			return true;
		}
		return false;
	}
}
