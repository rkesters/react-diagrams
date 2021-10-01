import { Matrix } from '../src/Matrix';
import { Point } from '../src/Point';
import { Polygon } from '../src/Polygon';
import { Rectangle } from '../src/Rectangle';

describe('Polygon', () => {
	describe('constructors', () => {
		test('Pointa', () => {
			const rect = new Rectangle(new Point(0, 0), new Point(1, 0), new Point(1, 1), new Point(0, 0));
			expect(rect.serialize()).toMatchInlineSnapshot(`
			Array [
			  Array [
			    0,
			    0,
			  ],
			  Array [
			    1,
			    0,
			  ],
			  Array [
			    1,
			    1,
			  ],
			  Array [
			    0,
			    0,
			  ],
			]
		`);
		});

		test('Point Position', () => {
			const rect = new Rectangle(new Point(0, 0), 10, 20);
			expect(rect.serialize()).toMatchInlineSnapshot(`
			Array [
			  Array [
			    0,
			    0,
			  ],
			  Array [
			    10,
			    0,
			  ],
			  Array [
			    10,
			    20,
			  ],
			  Array [
			    0,
			    20,
			  ],
			]
		`);
		});
		test('Position', () => {
			const rect = new Rectangle(0, 0, 10, 20);
			expect(rect.serialize()).toMatchInlineSnapshot(`
			Array [
			  Array [
			    0,
			    0,
			  ],
			  Array [
			    10,
			    0,
			  ],
			  Array [
			    10,
			    20,
			  ],
			  Array [
			    0,
			    20,
			  ],
			]
		`);
		});

		test('Default', () => {
			const rect = new Rectangle();
			expect(rect.serialize()).toMatchInlineSnapshot(`
			Array [
			  Array [
			    0,
			    0,
			  ],
			  Array [
			    0,
			    0,
			  ],
			  Array [
			    0,
			    0,
			  ],
			  Array [
			    0,
			    0,
			  ],
			]
		`);
		});

		test('pointsFromBounds', () => {
			const rect = Rectangle.pointsFromBounds(0, 0, 10, 20);
			expect(rect).toMatchInlineSnapshot(`
			Array [
			  Point {
			    "x": 0,
			    "y": 0,
			  },
			  Point {
			    "x": 10,
			    "y": 0,
			  },
			  Point {
			    "x": 10,
			    "y": 20,
			  },
			  Point {
			    "x": 0,
			    "y": 20,
			  },
			]
		`);
		});
	});

	describe('methods', () => {
		let rect = new Rectangle(0, 0, 10, 20);

		beforeEach(() => {
			rect = new Rectangle(0, 0, 10, 20);
		});

		test('updateDimensions', () => {
			rect.updateDimensions(3, 3, 10, 20);
			expect(rect.serialize()).toMatchInlineSnapshot(`
Array [
  Array [
    3,
    3,
  ],
  Array [
    13,
    3,
  ],
  Array [
    13,
    23,
  ],
  Array [
    3,
    23,
  ],
]
`);
		});

		test('updateDimensions', () => {
			rect.setPoints([new Point(0, 0), new Point(0, 1), new Point(1, 1), new Point(1, 0)]);
			expect(rect.serialize()).toMatchInlineSnapshot(`
Array [
  Array [
    0,
    0,
  ],
  Array [
    0,
    1,
  ],
  Array [
    1,
    1,
  ],
  Array [
    1,
    0,
  ],
]
`);
		});

		test('containsPoint', () => {
			expect(rect.containsPoint(new Point(0, 1))).toBeTruthy();
			expect(rect.containsPoint(new Point(0, -100))).toBeFalsy();
		});

		test('getWidth', () => {
			expect(rect.getWidth()).toMatchInlineSnapshot(`10`);
		});
		test('getHeight', () => {
			expect(rect.getHeight()).toMatchInlineSnapshot(`20`);
		});
		test('getTopMiddle', () => {
			expect(rect.getTopMiddle()).toMatchInlineSnapshot(`
Point {
  "x": 5,
  "y": 0,
}
`);
		});

		test('getBottomMiddle', () => {
			expect(rect.getBottomMiddle()).toMatchInlineSnapshot(`
Point {
  "x": 5,
  "y": 20,
}
`);
		});
		test('getLeftMiddle', () => {
			expect(rect.getLeftMiddle()).toMatchInlineSnapshot(`
Point {
  "x": 0,
  "y": 10,
}
`);
		});
		test('getRightMiddle', () => {
			expect(rect.getRightMiddle()).toMatchInlineSnapshot(`
Point {
  "x": 10,
  "y": 10,
}
`);
		});
		test('getTopLeft', () => {
			expect(rect.getTopLeft()).toMatchInlineSnapshot(`
Point {
  "x": 0,
  "y": 0,
}
`);
		});
		test('getTopRight', () => {
			expect(rect.getTopRight()).toMatchInlineSnapshot(`
Point {
  "x": 10,
  "y": 0,
}
`);
		});
		test('getBottomRight', () => {
			expect(rect.getBottomRight()).toMatchInlineSnapshot(`
Point {
  "x": 10,
  "y": 20,
}
`);
		});
		test('getBottomLeft', () => {
			expect(rect.getBottomLeft()).toMatchInlineSnapshot(`
Point {
  "x": 0,
  "y": 20,
}
`);
		});
	});
});
