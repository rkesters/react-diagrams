import { Matrix } from '../src/Matrix';
import { Point } from '../src/Point';
import { Polygon } from '../src/Polygon';

describe('Polygon', () => {
	test('default ctor', () => {
		const polygon = new Polygon();

		const serialize = polygon.serialize();
		expect(serialize).toMatchInlineSnapshot(`Array []`);
		polygon.setPoints([new Point(0, 1)]);
		expect(polygon.serialize()).toMatchInlineSnapshot(`
		Array [
		  Array [
		    0,
		    1,
		  ],
		]
	`);
		polygon.deserialize(serialize);
		expect(polygon.serialize()).toMatchInlineSnapshot(`Array []`);
	});

	test('rotate', () => {
		const polygon = new Polygon([new Point(0, 0), new Point(0, 1), new Point(1, 1), new Point(0, 0)]);
		expect(polygon.serialize()).toMatchInlineSnapshot(`
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
		    0,
		    0,
		  ],
		]
	`);

		polygon.rotate(90);
		expect(polygon).toMatchInlineSnapshot(`
		Polygon {
		  "points": Array [
		    Point {
		      "x": 1,
		      "y": 0,
		    },
		    Point {
		      "x": 0,
		      "y": 0,
		    },
		    Point {
		      "x": 0,
		      "y": 0,
		    },
		    Point {
		      "x": 0,
		      "y": 0,
		    },
		  ],
		}
	`);
	});

	test('scale', () => {
		const polygon = new Polygon([new Point(0, 0), new Point(0, 1), new Point(1, 1), new Point(0, 0)]);
		expect(polygon.serialize()).toMatchInlineSnapshot(`
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
		    0,
		    0,
		  ],
		]
	`);

		polygon.scale(5, 5, new Point(0, 0));
		expect(polygon).toMatchInlineSnapshot(`
		Polygon {
		  "points": Array [
		    Point {
		      "x": 0,
		      "y": 0,
		    },
		    Point {
		      "x": 0,
		      "y": 0,
		    },
		    Point {
		      "x": 0,
		      "y": 0,
		    },
		    Point {
		      "x": 0,
		      "y": 0,
		    },
		  ],
		}
	`);
	});
	//-----
	test('transform', () => {
		const polygon = new Polygon([new Point(0, 0), new Point(0, 1), new Point(1, 1), new Point(0, 0)]);
		expect(polygon.serialize()).toMatchInlineSnapshot(`
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
		    0,
		    0,
		  ],
		]
	`);

		polygon.transform(new Matrix([[2], [2]]));
		expect(polygon).toMatchInlineSnapshot(`
		Polygon {
		  "points": Array [
		    Point {
		      "x": 0,
		      "y": 0,
		    },
		    Point {
		      "x": 0,
		      "y": 0,
		    },
		    Point {
		      "x": 0,
		      "y": 0,
		    },
		    Point {
		      "x": 0,
		      "y": 0,
		    },
		  ],
		}
	`);
	});

	test('translate', () => {
		const polygon = new Polygon([new Point(0, 0), new Point(0, 1), new Point(1, 1), new Point(0, 0)]);
		expect(polygon.serialize()).toMatchInlineSnapshot(`
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
		    0,
		    0,
		  ],
		]
	`);

		polygon.translate(5, 5);
		expect(polygon).toMatchInlineSnapshot(`
		Polygon {
		  "points": Array [
		    Point {
		      "x": 5,
		      "y": 5,
		    },
		    Point {
		      "x": 5,
		      "y": 6,
		    },
		    Point {
		      "x": 6,
		      "y": 6,
		    },
		    Point {
		      "x": 5,
		      "y": 5,
		    },
		  ],
		}
	`);
	});

	test('doClone', () => {
		const polygon = new Polygon([new Point(0, 0), new Point(0, 1), new Point(1, 1), new Point(0, 0)]);
		expect(polygon.serialize()).toMatchInlineSnapshot(`
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
		    0,
		    0,
		  ],
		]
	`);

		polygon.doClone(polygon);
		expect(polygon).toMatchInlineSnapshot(`
		Polygon {
		  "points": Array [
		    Point {
		      "x": 0,
		      "y": 0,
		    },
		    Point {
		      "x": 0,
		      "y": 1,
		    },
		    Point {
		      "x": 1,
		      "y": 1,
		    },
		    Point {
		      "x": 0,
		      "y": 0,
		    },
		  ],
		}
	`);
	});

	test('clone', () => {
		const polygon = new Polygon([new Point(0, 0), new Point(0, 1), new Point(1, 1), new Point(0, 0)]);
		expect(polygon.serialize()).toMatchInlineSnapshot(`
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
		    0,
		    0,
		  ],
		]
	`);

		expect(polygon.clone()).toMatchInlineSnapshot(`
		Polygon {
		  "points": Array [
		    Point {
		      "x": 0,
		      "y": 0,
		    },
		    Point {
		      "x": 0,
		      "y": 1,
		    },
		    Point {
		      "x": 1,
		      "y": 1,
		    },
		    Point {
		      "x": 0,
		      "y": 0,
		    },
		  ],
		}
	`);
	});

	// -----
	test('getOrigin', () => {
		const polygon = new Polygon([new Point(0, 0), new Point(0, 1), new Point(1, 1), new Point(0, 0)]);
		expect(polygon.serialize()).toMatchInlineSnapshot(`
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
		    0,
		    0,
		  ],
		]
	`);

		expect(polygon.getOrigin()).toMatchInlineSnapshot(`
		Point {
		  "x": 0.5,
		  "y": 0.5,
		}
	`);
	});

	test('boundingBoxFromPolygons', () => {
		const polygon = new Polygon([new Point(0, 0), new Point(0, 1), new Point(1, 1), new Point(0, 0)]);
		expect(polygon.serialize()).toMatchInlineSnapshot(`
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
		    0,
		    0,
		  ],
		]
	`);

		const p2 = polygon.clone();
		p2.translate(5, 5);
		expect(Polygon.boundingBoxFromPolygons([polygon, p2])).toMatchInlineSnapshot(`
		Rectangle {
		  "points": Array [
		    Point {
		      "x": 0,
		      "y": 0,
		    },
		    Point {
		      "x": 6,
		      "y": 0,
		    },
		    Point {
		      "x": 6,
		      "y": 6,
		    },
		    Point {
		      "x": 0,
		      "y": 6,
		    },
		  ],
		}
	`);
	});

	test('boundingBoxFromPoints', () => {
		const polygon = new Polygon([new Point(0, 0), new Point(0, 1), new Point(1, 1), new Point(0, 0)]);
		expect(polygon.serialize()).toMatchInlineSnapshot(`
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
		    0,
		    0,
		  ],
		]
	`);

		expect(Polygon.boundingBoxFromPoints(polygon.getPoints())).toMatchInlineSnapshot(`
		Rectangle {
		  "points": Array [
		    Point {
		      "x": 0,
		      "y": 0,
		    },
		    Point {
		      "x": 1,
		      "y": 0,
		    },
		    Point {
		      "x": 1,
		      "y": 1,
		    },
		    Point {
		      "x": 0,
		      "y": 1,
		    },
		  ],
		}
	`);
	});

	test('getBoundingBox', () => {
		const polygon = new Polygon([new Point(0, 0), new Point(0, 1), new Point(1, 1), new Point(0, 0)]);
		expect(polygon.serialize()).toMatchInlineSnapshot(`
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
		    0,
		    0,
		  ],
		]
	`);

		expect(polygon.getBoundingBox()).toMatchInlineSnapshot(`
		Rectangle {
		  "points": Array [
		    Point {
		      "x": 0,
		      "y": 0,
		    },
		    Point {
		      "x": 1,
		      "y": 0,
		    },
		    Point {
		      "x": 1,
		      "y": 1,
		    },
		    Point {
		      "x": 0,
		      "y": 1,
		    },
		  ],
		}
	`);
	});
});
