import { CanvasEngine } from '..';
import { AbstractDisplacementState, AbstractDisplacementStateEvent } from '../core-state/AbstractDisplacementState';
import { State } from '../core-state/State';

export interface DragCanvasStateOptions {
	/**
	 * If enabled, the canvas is available to drag
	 */
	allowDrag?: boolean;
}

export class DragCanvasState extends AbstractDisplacementState {
	// store this as we drag the canvas
	initialCanvasX: number ;
	initialCanvasY: number ;
	config: DragCanvasStateOptions;

	constructor(engine: CanvasEngine, options: DragCanvasStateOptions = {}) {
		super(engine,{
			name: 'drag-canvas'
		});
		this.config = {
			allowDrag: true,
			...options
		};
		this.initialCanvasX = 0;
		this.initialCanvasY= 0;
	}

	async activated(prev: DragCanvasState) {
		super.activated(prev);
		this.engine.getModel().clearSelection();
		await this.engine.repaintCanvas(true);

		// we can block layer rendering because we are only targeting the transforms
		for (let layer of this.engine.getModel().getLayers()) {
			layer.allowRepaint(false);
		}

		this.initialCanvasX = this.engine.getModel().getOffsetX() ?? 0;
		this.initialCanvasY = this.engine.getModel().getOffsetY() ?? 0;
	}

	deactivated(next: State) {
		super.deactivated(next);
		for (let layer of this.engine.getModel().getLayers()) {
			layer.allowRepaint(true);
		}
	}

	fireMouseMoved(event: AbstractDisplacementStateEvent) {
		if (this.config.allowDrag) {
			this.engine
				.getModel()
				.setOffset(this.initialCanvasX + event.displacementX, this.initialCanvasY + event.displacementY);
			this.engine.repaintCanvas();
		}
	}
}
