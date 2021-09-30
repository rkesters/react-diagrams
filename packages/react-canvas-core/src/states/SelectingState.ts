import { State } from '../core-state/State';
import { Action, ActionEvent, InputType } from '../core-actions/Action';
import { SelectionBoxState } from './SelectionBoxState';
import { MouseEvent } from 'react';
import { CanvasEngine } from '..';

export class SelectingState extends State {
	constructor(engine: CanvasEngine) {
		super(engine, {
			name: 'selecting'
		});
		this.keys = ['shift'];

		this.registerAction(
			new Action({
				type: InputType.MOUSE_DOWN,
				fire: (event: ActionEvent<MouseEvent>) => {
					const element = this.engine.getActionEventBus().getModelForEvent(event);

					// go into a selection box on the canvas state
					if (!element) {
						this.transitionWithEvent(new SelectionBoxState(this.engine), event);
					} else {
						element.setSelected(true);
						this.engine.repaintCanvas();
					}
				}
			}, engine)
		);
	}
}
