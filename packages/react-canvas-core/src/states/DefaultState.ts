import { State } from '../core-state/State';
import { Action, ActionEvent, InputType } from '../core-actions/Action';
import { MouseEvent, TouchEvent } from 'react';
import { DragCanvasState } from './DragCanvasState';
import { SelectingState } from './SelectingState';
import { MoveItemsState } from './MoveItemsState';
import { CanvasEngine } from '..';

export class DefaultState extends State {
	constructor(engine: CanvasEngine) {
		super(engine, {
			name: 'default'
		});
		this.childStates = [new SelectingState(engine)];

		// determine what was clicked on
		this.registerAction(
			new Action({
				type: InputType.MOUSE_DOWN,
				fire: (event: ActionEvent<MouseEvent>) => {
					const element = this.engine.getActionEventBus().getModelForEvent(event);

					// the canvas was clicked on, transition to the dragging canvas state
					if (!element) {
						this.transitionWithEvent(new DragCanvasState(engine), event);
					} else {
						this.transitionWithEvent(new MoveItemsState(engine), event);
					}
				}
			}, engine)
		);

		// touch drags the canvas
		this.registerAction(
			new Action({
				type: InputType.TOUCH_START,
				fire: (event: ActionEvent<TouchEvent>) => {
					this.transitionWithEvent(new DragCanvasState(engine), event);
				}
			}, engine)
		);
	}
}
