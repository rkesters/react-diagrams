import * as React from 'react';
import { DiagramEngine } from '../../DiagramEngine';
import { LabelModel } from './LabelModel';
import styled from '@emotion/styled';
import { get } from 'lodash';

export interface LabelWidgetProps {
	engine: DiagramEngine;
	label: LabelModel;
	index: number;
}

namespace S {
	export const Label = styled.div`
		display: inline-block;
		position: absolute;
	`;

	export const Foreign = styled.foreignObject`
		pointer-events: none;
		overflow: visible;
	`;
}

export class LabelWidget extends React.Component<LabelWidgetProps> {
	ref: React.RefObject<HTMLDivElement>;

	constructor(props: LabelWidgetProps) {
		super(props);
		this.ref = React.createRef();
	}

	componentDidUpdate() {
		window.requestAnimationFrame(this.calculateLabelPosition);
	}

	componentDidMount() {
		window.requestAnimationFrame(this.calculateLabelPosition);
	}

	findPathAndRelativePositionToRenderLabel = (index: number): { path: SVGPathElement; position: number } | undefined => {
		// an array to hold all path lengths, making sure we hit the DOM only once to fetch this information
		const link = this.props.label.getParent();
		const paths =link?.getRenderedPath();
		if (!link || !paths) {
			throw new Error(`Failed to findPathAndRelativePositionToRenderLabel for index ${index}`);
		}
		const lengths = paths.map((path) => path.getTotalLength()) ?? [];

		// calculate the point where we want to display the label
		let labelPosition =
			lengths?.reduce((previousValue, currentValue) => previousValue + currentValue, 0) *
			(index / (link.getLabels().length + 1));

		// find the path where the label will be rendered and calculate the relative position
		let pathIndex = 0;
		while (pathIndex < paths.length) {
			if (labelPosition - lengths[pathIndex] < 0) {
				return {
					path: paths[pathIndex],
					position: labelPosition
				};
			}

			// keep searching
			labelPosition -= lengths[pathIndex];
			pathIndex++;
		}
	};

	calculateLabelPosition = () => {
		if (!this.ref.current) {
			return;
		}
		const found = this.findPathAndRelativePositionToRenderLabel(this.props.index + 1);
		if (!found) {
			return;
		}

		const { path, position } = found;

		const labelDimensions = {
			width: this.ref.current.offsetWidth ?? 0,
			height: this.ref.current.offsetHeight ?? 0
		};

		const pathCentre = path.getPointAtLength(position);

		const labelCoordinates = {
			x: pathCentre.x - labelDimensions.width / 2 + get(this.props.label.getOptions(), 'offsetX', 0),
			y: pathCentre.y - labelDimensions.height / 2 + get(this.props.label.getOptions(), 'offsetY', 0)
		};

		this.ref.current.style.transform = `translate(${labelCoordinates.x}px, ${labelCoordinates.y}px)`;
	};

	render() {
		const canvas = this.props.engine.getCanvas();

		return (
			<S.Foreign key={this.props.label.getID()} width={canvas?.offsetWidth} height={canvas?.offsetHeight}>
				<S.Label ref={this.ref}>
					{this.props.engine.getFactoryForLabel(this.props.label).generateReactWidget({ model: this.props.label })}
				</S.Label>
			</S.Foreign>
		);
	}
}
