import {
	AbstractDisplacementState,
	AbstractDisplacementStateEvent,
	Action,
	ActionEvent,
	InputType
} from '@projectstorm/react-canvas-core';
import { PortModel } from '../entities/port/PortModel';
import { MouseEvent } from 'react';
import { LinkModel } from '../entities/link/LinkModel';
import { DiagramEngine } from '../DiagramEngine';

export interface DragNewLinkStateOptions {
	/**
	 * If enabled, the links will stay on the canvas if they dont connect to a port
	 * when dragging finishes
	 */
	allowLooseLinks?: boolean;
	/**
	 * If enabled, then a link can still be drawn from the port even if it is locked
	 */
	allowLinksFromLockedPorts?: boolean;
}

export class DragNewLinkState extends AbstractDisplacementState<DiagramEngine> {
	port: PortModel | undefined | null;
	link: LinkModel | undefined | null;
	config: DragNewLinkStateOptions;

	constructor(engine: DiagramEngine, options: DragNewLinkStateOptions = {}) {
		super(engine, { name: 'drag-new-link' });

		this.config = {
			allowLooseLinks: true,
			allowLinksFromLockedPorts: false,
			...options
		};
		console.log(`DragNewLinkState registing actions`);
		this.registerAction(
			new Action({
				type: InputType.MOUSE_DOWN,
				//TODO: FIX ANY
				fire: (event: ActionEvent<MouseEvent, any>) => {
					console.log(`DragNewLinkState firing mouse down`);
					this.port = this.engine.getMouseElement(event.event) as PortModel;
					if (!this.config.allowLinksFromLockedPorts && this.port.isLocked()) {
						this.eject();
						return;
					}
					this.link = this.port.createLinkModel();

					// if no link is given, just eject the state
					if (!this.link) {
						console.log(`DragNewLinkState ejecting link`);
						this.eject();
						return;
					}
					this.link.setSelected(true);
					this.link.setSourcePort(this.port);
					this.engine.getModel().addLink(this.link);
					this.port.reportPosition();
				}
			},engine)
		);

		this.registerAction(
			new Action({
				type: InputType.MOUSE_UP,
				fire: (event: ActionEvent<MouseEvent>) => {
					const model = this.engine.getMouseElement(event.event);
					// check to see if we connected to a new port
					if (model instanceof PortModel) {
						if (this.port?.canLinkToPort(model)) {
							this.link?.setTargetPort(model);
							model.reportPosition();
							this.engine.repaintCanvas();
							return;
						} else {
							this.link?.remove();
							this.engine.repaintCanvas();
							return;
						}
					}

					if (!this.config.allowLooseLinks) {
						this.link?.remove();
						this.engine.repaintCanvas();
					}
				}
			}, engine)
		);
	}

	/**
	 * Calculates the link's far-end point position on mouse move.
	 * In order to be as precise as possible the mouse initialXRelative & initialYRelative are taken into account as well
	 * as the possible engine offset
	 */
	fireMouseMoved(event: AbstractDisplacementStateEvent):void {

		const portPos = this.port?.getPosition();
		if (!portPos) {return;}
		const zoomLevelPercentage = this.engine.getModel().getZoomLevel() / 100;
		const engineOffsetX = this.engine.getModel().getOffsetX() / zoomLevelPercentage;
		const engineOffsetY = this.engine.getModel().getOffsetY() / zoomLevelPercentage;
		const initialXRelative = this.initialXRelative / zoomLevelPercentage;
		const initialYRelative = this.initialYRelative / zoomLevelPercentage;
		const linkNextX = portPos.x - engineOffsetX + (initialXRelative - portPos.x) + event.virtualDisplacementX;
		const linkNextY = portPos.y - engineOffsetY + (initialYRelative - portPos.y) + event.virtualDisplacementY;

		this.link?.getLastPoint().setPosition(linkNextX, linkNextY);
		this.engine.repaintCanvas();
	}
}
