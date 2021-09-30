import { MouseEvent, TouchEvent } from 'react';
import { AbstractDisplacementState, AbstractDisplacementStateEvent } from '../core-state/AbstractDisplacementState';
import { State } from '../core-state/State';
import { SelectionLayerModel } from '../entities/selection/SelectionLayerModel';
import { Point, Rectangle } from '@projectstorm/geometry';
import { ModelGeometryInterface } from '../core/ModelGeometryInterface';
import { CanvasEngine } from '..';

export interface IClientRect {
	left: number;
	top: number;
	right: number;
	bottom: number;
	width: number;
	height: number;
}

function isaMouseEvent(value: unknown): value is MouseEvent {
	return value instanceof MouseEvent
}

export class SelectionBoxState extends AbstractDisplacementState {
	layer: SelectionLayerModel ;

	constructor(engine: CanvasEngine) {
		super(engine, {
			name: 'selection-box'
		});
		this.layer = new SelectionLayerModel();
	}

	activated(previous: State) {
		super.activated(previous);
		this.engine.getModel().addLayer(this.layer);
	}

	deactivated(next: State) {
		super.deactivated(next);
		this.layer.remove();
		this.engine.repaintCanvas();
		this.layer = new SelectionLayerModel();
	}

	getBoxDimensions(stateEvent: AbstractDisplacementStateEvent): IClientRect {
		const event = stateEvent.event;

		const rel: Point = isaMouseEvent(event)  ? this.engine.getRelativePoint(event.clientX, event.clientY) :
		this.engine.getRelativePoint(event.touches[0].clientX, event.touches[0].clientY);


		return {
			left: rel.x > this.initialXRelative ? this.initialXRelative : rel.x,
			top: rel.y > this.initialYRelative ? this.initialYRelative : rel.y,
			width: Math.abs(rel.x - this.initialXRelative),
			height: Math.abs(rel.y - this.initialYRelative),
			right: rel.x < this.initialXRelative ? this.initialXRelative : rel.x,
			bottom: rel.y < this.initialYRelative ? this.initialYRelative : rel.y
		};
	}

	fireMouseMoved(event: AbstractDisplacementStateEvent) {
		this.layer.setBox(this.getBoxDimensions(event));

		const relative = this.engine.getRelativeMousePoint({
			clientX: this.initialX,
			clientY: this.initialY
		});
		if (event.virtualDisplacementX < 0) {
			relative.x -= Math.abs(event.virtualDisplacementX);
		}
		if (event.virtualDisplacementY < 0) {
			relative.y -= Math.abs(event.virtualDisplacementY);
		}
		const rect = new Rectangle(relative, Math.abs(event.virtualDisplacementX), Math.abs(event.virtualDisplacementY));

		for (let model of this.engine.getModel().getSelectionEntities()) {
			if ((model as unknown as ModelGeometryInterface).getBoundingBox) {
				const bounds = (model as unknown as ModelGeometryInterface).getBoundingBox();
				if (rect.containsPoint(bounds.getTopLeft()) && rect.containsPoint(bounds.getBottomRight())) {
					model.setSelected(true);
				} else {
					model.setSelected(false);
				}
			}
		}

		this.engine.repaintCanvas();
	}
}
