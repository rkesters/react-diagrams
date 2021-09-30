import * as React from 'react';
import { DefaultLinkFactory } from './DefaultLinkFactory';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import { DefaultLinkModel } from './DefaultLinkModel';

export interface DefaultLinkSegmentWidgetProps {
	path: string;
	link: DefaultLinkModel | null;
	selected: boolean;
	forwardRef: React.RefObject<SVGPathElement>;
	factory: DefaultLinkFactory | null | undefined;
	diagramEngine: DiagramEngine | null;
	onSelection: (selected: boolean) => any;
	extras: object;
}

export class DefaultLinkSegmentWidget extends React.Component<DefaultLinkSegmentWidgetProps> {
	render() {
		const factory = this.props.factory;
		const link = this.props.link;
		if (!factory || !link) {return (<> </>)}
		const Bottom = React.cloneElement(
			factory.generateLinkSegment(
				link,
				this.props.selected || link.isSelected(),
				this.props.path
			),
			{
				ref: this.props.forwardRef
			}
		);

		const Top = React.cloneElement(Bottom, {
			strokeLinecap: 'round',
			onMouseLeave: () => {
				this.props.onSelection(false);
			},
			onMouseEnter: () => {
				this.props.onSelection(true);
			},
			...this.props.extras,
			ref: null,
			'data-linkid': link.getID(),
			strokeOpacity: this.props.selected ? 0.1 : 0,
			strokeWidth: 20,
			fill: 'none',
			onContextMenu: () => {
				if (!link.isLocked()) {
					event?.preventDefault();
					link.remove();
				}
			}
		});

		return (
			<g>
				{Bottom}
				{Top}
			</g>
		);
	}
}
