declare module 'paths-js/path' {
	export interface Instruction {
		params: number[];
		command: 'default' | 'V' | 'H' | 'A' | 'C' | 'Z';
	}

	export interface Point {
		x: number;
		y: number;
	}

	export interface CurveTo {
		x1: number;
		y1: number;
		x2: number;
		y2: number;
		x: number;
		y: number;
	}

	export interface SmoothCurveTo {
		x2: number;
		y2: number;
		x: number;
		y: number;
	}

	export interface QCurveTo {
		x1: number;
		y1: number;
		x: number;
		y: number;
	}

	export interface Arc {
		rx: number;
		ry: number;
		xrot: number;
		largeArcFlag: number;
		sweepFlag: number;
		x: number;
		y: number;
	}

	export interface Translate {
		dx: number;
		dy: number;
	}

	export interface Rotate {
		angle: number;
		rx: number;
		ry: number;
	}

	export interface Scale {
		sx: number;
		sy: number;
	}

	export interface Shear {

	}

	export interface IPath {
		moveto(point: Point): IPath;
		moveto(x: number, y: number): IPath;
		moveto(x: number | Point, y?: number): IPath;

		lineto(point: Point): IPath;
		lineto(x: number, y: number): IPath;
		lineto(x: number | Point, y?: number): IPath;

		hlineto(point: Point): IPath;
		hlineto(x: number, y: number): IPath;
		hlineto(x: number | Point, y?: number): IPath;

		vlineto(point: Point): IPath;
		vlineto(x: number, y: number): IPath;
		vlineto(x: number | Point, y?: number): IPath;

		closepath(): IPath;

		curveto(curve: CurveTo): IPath;
		curveto(x1: number, y1: number, x2: number, y2: number, x: number): IPath;
		curveto(x1: number | CurveTo, y1?: number, x2?: number, y2?: number, x?: number): IPath;

		smoothcurveto(point: SmoothCurveTo): IPath;
		smoothcurveto(x2: number, y2: number, x: number): IPath;
		smoothcurveto(x2: number | SmoothCurveTo, y2?: number, x?: number): IPath;

		qcurveto(point: QCurveTo): IPath;
		qcurveto(x1: number, y1: number, x: number): IPath;
		qcurveto(x1: number | QCurveTo, y1?: number, x?: number): IPath;

		smoothqcurveto(point: Point): IPath;
		smoothqcurveto(x: number, y: number): IPath;
		smoothqcurveto(x: number | Point, y?: number): IPath;

		arc(point: Arc): IPath;
		arc(rx: number, ry: number, xrot: number, largeArcFlag: number, sweepFlag: number, x: number, y: number): IPath;
		arc(
			rx: number | Arc,
			ry?: number,
			xrot?: number,
			largeArcFlag?: number,
			sweepFlag?: number,
			x?: number,
			y?: number
		): IPath;

		translate(point: Translate): IPath;
		translate(dx: number, dy: number): IPath;
		translate(dx: number | Translate, dy?: number): IPath;

		rotate(point: Rotate): IPath;
		rotate(angle: number, rx: number, ry: number): IPath;
		rotate(angle: number | Rotate, rx: number, ry: number): IPath;

		scale(scaleBy: Scale): IPath;
		scale(sx: number, sy: number): IPath;
		scale(sx: number | Scale, sy?: number): IPath;

		shearX(angle: Scale): IPath;
		shearX(angle: number): IPath;
		shearX(angle: Scale | number): IPath;

		shearY(angle: Scale): IPath;
		shearY(angle: number): IPath;
		shearY(angle: Scale | number): IPath;

		print(): string;
		toString(): string;
		points() : [number, number][];
		instructions() : Instruction[];

		connect(path: IPath): IPath;
	}

	export default function Path(init?: Instruction[]): IPath;
}
