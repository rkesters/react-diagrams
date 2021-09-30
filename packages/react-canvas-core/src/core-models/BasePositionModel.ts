import { BaseModel, BaseModelGenerics, BaseModelListener, BaseModelOptions } from './BaseModel';
import { BaseEntityEvent, DeserializeEvent } from './BaseEntity';
import { Point, Rectangle } from '@projectstorm/geometry';
import { ModelGeometryInterface } from '../core/ModelGeometryInterface';

export interface BasePositionModelListener extends BaseModelListener {
	positionChanged(event: BaseEntityEvent<BasePositionModel>): void;
}

export interface BasePositionModelOptions extends BaseModelOptions {
	position?: Point;
}

export interface BasePositionModelGenerics extends BaseModelGenerics {
	LISTENER: BasePositionModelListener;
	OPTIONS: BasePositionModelOptions;
}

export class BasePositionModel<G extends BasePositionModelGenerics = BasePositionModelGenerics>
	extends BaseModel<G>
	implements ModelGeometryInterface
{
	protected position: Point;

	constructor(options: G['OPTIONS']) {
		super(options);
		this.position = options.position || new Point(0, 0);
	}

	setPosition(point: Point): void;
	setPosition(x: number, y: number): void;
	setPosition(x: Point | number , y?: number | undefined ) {
		this.position = Point.isa(x) ? x : new Point(x,y as number);
		this.fireEvent({}, 'positionChanged');
	}

	getBoundingBox(): Rectangle {
		return new Rectangle(this.position, 0, 0);
	}

	deserialize(event: DeserializeEvent<ReturnType<BasePositionModel['serialize']>>) {
		super.deserialize(event);
		this.position = new Point(event.data.x, event.data.y);
	}

	serialize() {
		return {
			...super.serialize(),
			x: this.position.x,
			y: this.position.y
		};
	}

	getPosition(): Point {
		return this.position;
	}

	getX(): number {
		return this.position.x;
	}

	getY() {
		return this.position.y;
	}
}
