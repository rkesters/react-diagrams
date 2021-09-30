import { MouseEvent, TouchEvent } from 'react';
import {
	SelectingState,
	State,
	Action,
	InputType,
	ActionEvent,
	DragCanvasState
} from '@projectstorm/react-canvas-core';
import { PortModel } from '../entities/port/PortModel';
import { DragNewLinkState } from './DragNewLinkState';
import { DiagramEngine } from '../DiagramEngine';
import { DragDiagramItemsState } from './DragDiagramItemsState';

export class DefaultDiagramState extends State<DiagramEngine> {
	dragCanvas: DragCanvasState;
	dragNewLink: DragNewLinkState;
	dragItems: DragDiagramItemsState;

	constructor(engine: DiagramEngine) {
		super(engine, {
			name: 'default-diagrams'
		});
		this.childStates = [new SelectingState(engine)];
		this.dragCanvas = new DragCanvasState(engine);
		this.dragNewLink = new DragNewLinkState(engine);
		this.dragItems = new DragDiagramItemsState(engine);

		// determine what was clicked on
		this.registerAction(
			new Action({
				type: InputType.MOUSE_DOWN,
				fire: (event: ActionEvent<MouseEvent>) => {
					const element = this.engine.getActionEventBus().getModelForEvent(event);

					// the canvas was clicked on, transition to the dragging canvas state
					if (!element) {
						this.transitionWithEvent(this.dragCanvas, event);
					}
					// initiate dragging a new link
					else if (element instanceof PortModel) {
						this.transitionWithEvent(this.dragNewLink, event);
					}
					// move the items (and potentially link points)
					else {
						this.transitionWithEvent(this.dragItems, event);
					}
				}
			},engine)
		);

		// touch drags the canvas
		this.registerAction(
			new Action({
				type: InputType.TOUCH_START,
				fire: (event: ActionEvent<TouchEvent>) => {
					this.transitionWithEvent(this.dragCanvas, event);
				}
			},engine)
		);
	}
}
