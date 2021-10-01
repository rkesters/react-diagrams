import { isNumber } from 'lodash';
import { Point } from './Point';
import { Polygon } from './Polygon';

export class Rectangle extends Polygon {
	constructor(tl: Point, tr: Point, br: Point, bl: Point);
	constructor(position: Point, width: number, height: number);
	constructor(x?: number, y?: number, width?: number, height?: number);

	constructor(a: Point | number = 0, b: Point | number  = 0, c: Point | number  = 0, d: Point | number  = 0) {
		if (Point.isa(a) && Point.isa(b) && Point.isa(c) && Point.isa(d)) {
			super([a, b, c, d]);
			return;
		} else if (Point.isa(a) && isNumber(b) && isNumber(c) && isNumber(d)) {
			super([a, new Point(a.x + b, a.y), new Point(a.x + b, a.y + c), new Point(a.x, a.y + c)]);
			return;
		} else if (isNumber(a) && isNumber(b) && isNumber(c) && isNumber(d)) {
			super(Rectangle.pointsFromBounds(a, b, c, d));
			return;
		}

		throw new Error(`Rectangle call with invaild arguements: ${arguments.length}`);
	}

	static pointsFromBounds(x: number, y: number, width: number, height: number): Point[] {
		return [new Point(x, y), new Point(x + width, y), new Point(x + width, y + height), new Point(x, y + height)];
	}

	updateDimensions(x: number, y: number, width: number, height: number) {
		this.points = Rectangle.pointsFromBounds(x, y, width, height);
	}

	setPoints(points: Point[]) {
		if (points.length !== 4) {
			throw 'Rectangles must always have 4 points';
		}
		super.setPoints(points);
	}

	containsPoint(point: Point) {
		const tl = this.getTopLeft();
		const br = this.getBottomRight();

		return point.x >= tl.x && point.x <= br.x && point.y >= tl.y && point.y <= br.y;
	}

	getWidth(): number {
		return Math.sqrt(
			Math.pow(this.getTopLeft().x - this.getTopRight().x, 2) + Math.pow(this.getTopLeft().y - this.getTopRight().y, 2)
		);
	}

	getHeight(): number {
		return Math.sqrt(
			Math.pow(this.getBottomLeft().x - this.getTopLeft().x, 2) +
				Math.pow(this.getBottomLeft().y - this.getTopLeft().y, 2)
		);
	}

	getTopMiddle(): Point {
		return Point.middlePoint(this.getTopLeft(), this.getTopRight());
	}

	getBottomMiddle(): Point {
		return Point.middlePoint(this.getBottomLeft(), this.getBottomRight());
	}

	getLeftMiddle(): Point {
		return Point.middlePoint(this.getBottomLeft(), this.getTopLeft());
	}

	getRightMiddle(): Point {
		return Point.middlePoint(this.getBottomRight(), this.getTopRight());
	}

	getTopLeft(): Point {
		return this.points[0];
	}

	getTopRight(): Point {
		return this.points[1];
	}

	getBottomRight(): Point {
		return this.points[2];
	}

	getBottomLeft(): Point {
		return this.points[3];
	}
}
