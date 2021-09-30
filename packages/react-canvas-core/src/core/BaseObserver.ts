import { BaseEntity } from '..';
import { Toolkit } from '../Toolkit';
import { forEach, isFunction } from 'lodash';

export interface BaseEvent {
	firing?: boolean;
	stopPropagation?: () => any;
}

export interface BaseEventProxy extends BaseEvent {
	function: string;
}

interface BaseEventProgress extends BaseEvent {
	function: string;
}

export type ParameterFirst<T extends any, B> = T extends (first: infer P, ...r: any) => any
	? P extends B
		? P
		: never
	: never;

/**
 * Utility type that extracts functions of a type, that have the first arg
 * extending B.
 */
export type Methods<T, B = any> = {
	[P in keyof T as T[P] extends (first: infer p, ...r: any) => any ? (p extends B ? P : never) : never]: T[P];
};

type S<L extends BaseListener> = Methods<L, BaseEvent>;

type s = S<BaseListener>;

type l = BaseListener;
type B = BaseEvent;
type eventHandlers = Required<l>;
//{ [K in keyof F]: F[K] extends (first: infer P, ...r: any) => any ? P extends B ? F[K] : never : never; }
type events = keyof Methods<l>;
type FireEvent<Event extends events> = ParameterFirst<eventHandlers[Event], BaseEvent>;

type Id<T> = { [K in keyof T]: T[K] } & {};
//FireEvent<Event extends keyof BaseListener> = FunctionsOnly<BaseListener, entity>[Event] extends (first: infer P, ...r: any) => any ? P extends BaseEvent ? P : never : never

/**
 * Listeners are always in the form of an object that contains methods that take events
 */
export interface BaseListener extends Record<string, (event: any) => void> {
	/**
	 * Generic event that fires before a specific event was fired
	 */
	eventWillFire(event: BaseEventProgress): void;

	/**
	 * Generic event that fires after a specific event was fired (even if it was consumed)
	 */
	eventDidFire (event: BaseEventProgress) :void;
}

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
	listener: Partial<BaseListener>;
}

type ParameterFirstBaseEvent<L extends BaseListener, Event extends keyof Methods<L, BaseEvent>> = ParameterFirst<
	Methods<L, BaseEvent>[Event],
	BaseEvent
>;

export function isHandler(value: unknown): value is (a: any) => void {
	return isFunction(value);
}
/**
 * Base observer pattern class for working with listeners
 */
export class BaseObserver<L extends BaseListener = BaseListener> {
	protected listeners: { [id: string]: Partial<L> };

	constructor() {
		this.listeners = {};
	}

	private fireEventInternal(fire: boolean, k: keyof L, event: BaseEvent) {
		this.iterateListeners((handlers: Partial<L>) => {
			// returning false here will instruct itteration to stop
			if (!fire && !event.firing) {
				return false;
			}
			// fire selected listener
			if (handlers) {
				const handler = handlers[k];
				if (isHandler(handler)) {
					handler(event as BaseEvent);
				}
			}
		});
	}

	fireEvent<Event extends keyof L>(event: Parameters<L[Event]>[0], k: Event) {
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

		// fire main event
		this.fireEventInternal(false, k, event as BaseEvent);

		// fire post
		this.fireEventInternal(true, 'eventDidFire', {
			...event,
			function: k
		} as BaseEventProxy);
	}

	iterateListeners(cb: (listener: Partial<L>) => any) {
		forEach(this.listeners, (handler) => {
			return cb(handler);
		});
	}

	getListenerHandle(listener: L): ListenerHandle | void {
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

	registerListener(listener: Partial<L>): ListenerHandle {
		const id = Toolkit.UID();
		this.listeners[id] = listener;
		return {
			id: id,
			listener: listener,
			deregister: () => {
				delete this.listeners[id];
			}
		};
	}

	deregisterListener(listener: L | ListenerHandle) {
		if (typeof listener === 'object') {
			(listener as ListenerHandle).deregister();
			return true;
		}
		const handle = this.getListenerHandle(listener);
		if (handle) {
			handle.deregister();
			return true;
		}
		return false;
	}
}
