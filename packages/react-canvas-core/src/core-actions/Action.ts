import { MouseEvent, KeyboardEvent, WheelEvent, TouchEvent, SyntheticEvent } from 'react';
import { Toolkit } from '../Toolkit';
import { CanvasEngine } from '../CanvasEngine';
import { BaseModel } from '../core-models/BaseModel';

export enum InputType {
	MOUSE_DOWN = 'mouse-down',
	MOUSE_UP = 'mouse-up',
	MOUSE_MOVE = 'mouse-move',
	MOUSE_WHEEL = 'mouse-wheel',
	KEY_DOWN = 'key-down',
	KEY_UP = 'key-up',
	TOUCH_START = 'touch-start',
	TOUCH_END = 'touch-end',
	TOUCH_MOVE = 'touch-move'
}

export interface Mapping {
	[InputType.MOUSE_DOWN]: MouseEvent;
	[InputType.MOUSE_UP]: MouseEvent;
	[InputType.MOUSE_MOVE]: MouseEvent;
	[InputType.MOUSE_WHEEL]: WheelEvent;
	[InputType.KEY_DOWN]: KeyboardEvent;
	[InputType.KEY_UP]: KeyboardEvent;
	[InputType.TOUCH_START]: TouchEvent;
	[InputType.TOUCH_END]: TouchEvent;
	[InputType.TOUCH_MOVE]: TouchEvent;
}

export interface ActionEvent<Event extends SyntheticEvent = SyntheticEvent, Model extends BaseModel = BaseModel> {
	event: Event;
	model?: Model;
}

export interface ActionOptionsMouse{
	type: InputType.MOUSE_DOWN | InputType.MOUSE_MOVE | InputType.MOUSE_UP;
	fire: (event: ActionEvent<MouseEvent>) => void;
}
export interface ActionOptionsWheel{
type: InputType.MOUSE_WHEEL;
fire: (event: ActionEvent<WheelEvent>) => void;
}

export interface ActionOptionsKeyboard{
type: InputType.KEY_DOWN | InputType.KEY_UP;
fire: (event: ActionEvent<KeyboardEvent>) => void;
}
export interface ActionOptionsTouch{
type: InputType.TOUCH_END | InputType.TOUCH_MOVE | InputType.TOUCH_START;
fire: (event: ActionEvent<TouchEvent>) => void;
}

type ActionOptions = ActionOptionsMouse | ActionOptionsWheel | ActionOptionsKeyboard  | ActionOptionsTouch

export class Action<T extends CanvasEngine = CanvasEngine> {
	options: ActionOptions;
	id: string;
	engine: T | undefined;

	constructor(options: ActionOptions) {
		this.options = options;
		this.id = Toolkit.UID();
	}

	setEngine(engine: T) {
		this.engine = engine;
	}
}
