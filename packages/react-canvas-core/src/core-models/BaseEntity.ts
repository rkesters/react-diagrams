import * as _ from 'lodash';
import { CanvasEngine } from '../CanvasEngine';
import { BaseEvent, BaseListener, BaseObserver, ParameterFirst } from '../core/BaseObserver';
import { Toolkit } from '../Toolkit';
import { BaseModel } from './BaseModel';

export interface BaseEntityEvent<T extends BaseEntity = BaseEntity> extends BaseEvent {
	entity?: T;
}

export interface LockChangedEvent<T extends BaseEntity = BaseEntity> extends BaseEntityEvent<T>  {
	locked: boolean;
}
export interface BaseEntityListener extends BaseListener {
	lockChanged(event: LockChangedEvent ): void;
}

export type BaseEntityType = 'node' | 'link' | 'port' | 'point';

export interface BaseEntityOptions {
	id?: string;
	locked?: boolean;
}

export type BaseEntityGenerics = {
	LISTENER: BaseEntityListener;
	OPTIONS: BaseEntityOptions;
};

export interface DeserializeEvent<S = ReturnType<BaseEntity['serialize']>> {
	engine: CanvasEngine;
	data: S;
	registerModel(model: BaseModel): void;
	getModel<T extends BaseModel>(id: string | null): Promise<T | null>;
}

type ff<T extends BaseEntityGenerics = BaseEntityGenerics> = ParameterFirst<T['LISTENER']['lockChanged'], BaseEvent>
const FF: ff = {locked: false, entity: {} as BaseEntity} ;
export class BaseEntity<T extends BaseEntityGenerics = BaseEntityGenerics> extends BaseObserver<T['LISTENER']> {
	protected options: T['OPTIONS'];

	protected id: string;
	constructor(options: T['OPTIONS'] = {}) {
		super();
		this.id = options.id ?? Toolkit.UID();
		this.options = {
			id: this.id,
			...options
		};
	}

	getOptions(): T['OPTIONS'] {
		return this.options;
	}

	getID(): string {
		return this.id;
	}

	doClone(lookupTable: { [s: string]: any } = {}, clone: any): void {
		/*noop*/
	}

	clone(lookupTable: { [s: string]: any } = {}) {
		// try and use an existing clone first
		if (lookupTable[this.id]) {
			return lookupTable[this.id];
		}
		let clone = _.cloneDeep(this);
		clone.options = {
			...this.options,
			id: Toolkit.UID()
		};
		clone.clearListeners();
		lookupTable[this.id] = clone;

		this.doClone(lookupTable, clone);
		return clone;
	}

	clearListeners() {
		this.listeners = {};
	}

	deserialize(event: DeserializeEvent<ReturnType<BaseEntity['serialize']>>) {
		this.options.id = event.data.id;
		this.options.locked = event.data.locked;
	}

	serialize() {
		return {
			id: this.options.id,
			locked: this.options.locked
		};
	}

	// fireEvent<Event extends keyof Methods<L, B>,>( k: keyof T['LISTENER'], event: L) {
	// 	super.fireEvent(
	// 		{
	// 			entity: this,
	// 			...event
	// 		},
	// 		k
	// 	);
	// }

	public isLocked(): boolean {
		return this.options.locked ?? false;
	}

	public setLocked(locked: boolean = true) {
		this.options.locked = locked;

		this.fireEvent(
			{ locked: true },
			'lockChanged'
		);
	}
}
