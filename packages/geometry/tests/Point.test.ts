import { Matrix } from '../src/Matrix';
import { Point } from '../src/Point';

describe('Point', () => {
	test('ctor', () => {
		const point = new Point(1, 1);

		expect(point.x).toMatchInlineSnapshot(`1`);
		expect(point.y).toMatchInlineSnapshot(`1`);
		expect(point.toSVG()).toMatchInlineSnapshot(`"1 1"`);
		expect(point.asMatrix()).toMatchInlineSnapshot(`
		Matrix {
		  "matrix": Array [
		    Array [
		      1,
		    ],
		    Array [
		      1,
		    ],
		    Array [
		      1,
		    ],
		  ],
		}
	`);
	});

	test('translate', () => {
		const point = new Point(1, 1);

		point.translate(1, 1);
		expect(point.x).toMatchInlineSnapshot(`2`);
		expect(point.y).toMatchInlineSnapshot(`2`);
	});

	test('clone', () => {
		const point = new Point(1, 1);

		const tpoint = point.clone();
		expect(tpoint.x).toMatchInlineSnapshot(`1`);
		expect(tpoint.y).toMatchInlineSnapshot(`1`);
	});

	test('transform', () => {
		const point = new Point(1, 1);

		point.transform(new Matrix([[4], [6]]));
		expect(point.x).toMatchInlineSnapshot(`4`);
		expect(point.y).toMatchInlineSnapshot(`6`);
	});

	test('middlePoint', () => {
		const point1 = new Point(0, 0);
		const point2 = new Point(10, 10);

		const tpoint = Point.middlePoint(point1, point2);
		expect(tpoint.x).toMatchInlineSnapshot(`5`);
		expect(tpoint.y).toMatchInlineSnapshot(`5`);
	});

	test('multiply', () => {
		const tpoint = Point.multiply(new Matrix([[4], [6]]), new Matrix([[4, 6]]));
		expect(tpoint.asArray()).toMatchInlineSnapshot(`
		Array [
		  Array [
		    16,
		    24,
		  ],
		  Array [
		    24,
		    36,
		  ],
		]
	`);
	});

	test('rotateMatrix', () => {
		const tpoint = Point.rotateMatrix(Math.PI / 2);
		expect(tpoint.asArray()).toMatchInlineSnapshot(`
		Array [
		  Array [
		    6.123233995736766e-17,
		    -1,
		    0,
		  ],
		  Array [
		    1,
		    6.123233995736766e-17,
		    0,
		  ],
		  Array [
		    0,
		    0,
		    1,
		  ],
		]
	`);
	});

	test('createScaleMatrix', () => {
		const point2 = new Point(10, 10);

		const tpoint = Point.createScaleMatrix(5, 5, point2);
		expect(tpoint.asArray()).toMatchInlineSnapshot(`
		Array [
		  Array [
		    5,
		    0,
		    -40,
		  ],
		  Array [
		    0,
		    5,
		    -40,
		  ],
		  Array [
		    0,
		    0,
		    1,
		  ],
		]
	`);
	});

	test('createRotateMatrix', () => {
		const point1 = new Point(0, 0);
		const point2 = new Point(10, 10);

		const tpoint = Point.createRotateMatrix(Math.PI / 4, point2);
		expect(tpoint.asArray()).toMatchInlineSnapshot(`
		Array [
		  Array [
		    0.7071067811865476,
		    -0.7071067811865475,
		    10,
		  ],
		  Array [
		    0.7071067811865475,
		    0.7071067811865476,
		    -4.142135623730951,
		  ],
		  Array [
		    0,
		    0,
		    1,
		  ],
		]
	`);
	});
});
