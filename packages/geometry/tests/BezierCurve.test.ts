import { BezierCurve } from '../src/BezierCurve';
import { Point } from '../src/Point';

describe('BezierCurve', () => {
	test('ctor', () => {
		const bCurve = new BezierCurve();

		expect(bCurve.getSVGCurve()).toMatchInlineSnapshot(`"M0 0 C0 0, 0 0, 0 0"`);
		expect(bCurve.getSource()).toMatchInlineSnapshot(`
		Point {
		  "x": 0,
		  "y": 0,
		}
	`);
		expect(bCurve.getSourceControl()).toMatchInlineSnapshot(`
		Point {
		  "x": 0,
		  "y": 0,
		}
	`);
		expect(bCurve.getTargetControl()).toMatchInlineSnapshot(`
		Point {
		  "x": 0,
		  "y": 0,
		}
	`);
		expect(bCurve.getTarget()).toMatchInlineSnapshot(`
		Point {
		  "x": 0,
		  "y": 0,
		}
	`);
	});
	test('setSource', () => {
		const bCurve = new BezierCurve();

		expect(bCurve.getSVGCurve()).toMatchInlineSnapshot(`"M0 0 C0 0, 0 0, 0 0"`);
		bCurve.setSource(new Point(100, -1));
		expect(bCurve.getSource()).toMatchInlineSnapshot(`
		Point {
		  "x": 100,
		  "y": -1,
		}
	`);
		expect(bCurve.getSVGCurve()).toMatchInlineSnapshot(`"M100 -1 C0 0, 0 0, 0 0"`);
	});

	test('setSourceControl', () => {
		const bCurve = new BezierCurve();

		expect(bCurve.getSVGCurve()).toMatchInlineSnapshot(`"M0 0 C0 0, 0 0, 0 0"`);
		bCurve.setSourceControl(new Point(100, -1));
		expect(bCurve.getSourceControl()).toMatchInlineSnapshot(`
		Point {
		  "x": 100,
		  "y": -1,
		}
	`);
		expect(bCurve.getSVGCurve()).toMatchInlineSnapshot(`"M0 0 C100 -1, 0 0, 0 0"`);
	});

	test('setTargetControl', () => {
		const bCurve = new BezierCurve();

		expect(bCurve.getSVGCurve()).toMatchInlineSnapshot(`"M0 0 C0 0, 0 0, 0 0"`);
		bCurve.setTargetControl(new Point(100, -1));
		expect(bCurve.getTargetControl()).toMatchInlineSnapshot(`
		Point {
		  "x": 100,
		  "y": -1,
		}
	`);
		expect(bCurve.getSVGCurve()).toMatchInlineSnapshot(`"M0 0 C0 0, 100 -1, 0 0"`);
	});

	test('setTarget', () => {
		const bCurve = new BezierCurve();

		expect(bCurve.getSVGCurve()).toMatchInlineSnapshot(`"M0 0 C0 0, 0 0, 0 0"`);
		bCurve.setTarget(new Point(100, -1));
		expect(bCurve.getTarget()).toMatchInlineSnapshot(`
		Point {
		  "x": 100,
		  "y": -1,
		}
	`);
		expect(bCurve.getSVGCurve()).toMatchInlineSnapshot(`"M0 0 C0 0, 0 0, 100 -1"`);
	});
	test('setPoints', () => {
		const bCurve = new BezierCurve();

		expect(bCurve.getSVGCurve()).toMatchInlineSnapshot(`"M0 0 C0 0, 0 0, 0 0"`);
		bCurve.setPoints([new Point(100, -1), new Point(200, -2), new Point(300, -3), new Point(400, -4)]);
		expect(bCurve.getPoints()).toMatchInlineSnapshot(`
		Array [
		  Point {
		    "x": 100,
		    "y": -1,
		  },
		  Point {
		    "x": 200,
		    "y": -2,
		  },
		  Point {
		    "x": 300,
		    "y": -3,
		  },
		  Point {
		    "x": 400,
		    "y": -4,
		  },
		]
	`);
		expect(bCurve.getSVGCurve()).toMatchInlineSnapshot(`"M100 -1 C200 -2, 300 -3, 400 -4"`);

		expect(() => {
			bCurve.setPoints([new Point(200, -2), new Point(300, -3), new Point(400, -4)]);
		}).toThrow();
	});
});
