import { Matrix } from '../src/Matrix';

describe('Matrix', () => {
	test('ctor', () => {
		const matrix = new Matrix([
			[1, 0],
			[0, 1]
		]);
		expect(matrix.asArray()).toMatchInlineSnapshot(`
		Array [
		  Array [
		    1,
		    0,
		  ],
		  Array [
		    0,
		    1,
		  ],
		]
	`);
		expect(matrix.get(1, 0)).toMatchInlineSnapshot(`0`);
		expect(matrix.get(1, 1)).toMatchInlineSnapshot(`1`);
		expect(matrix.get(0, 1)).toMatchInlineSnapshot(`0`);
		expect(matrix.get(0, 0)).toMatchInlineSnapshot(`1`);
	});

	test('mmul', () => {
		const matrix1 = new Matrix([
			[1, 0],
			[0, 1]
		]);
		const matrix2 = new Matrix([
			[1, 0, 1],
			[0, 1, 2]
		]);
		const result = matrix1.mmul(matrix1);
		expect(result.asArray()).toMatchInlineSnapshot(`
Array [
  Array [
    1,
    0,
  ],
  Array [
    0,
    1,
  ],
]
`);
		expect(matrix1.mmul(matrix2)).toMatchInlineSnapshot(`
Matrix {
  "matrix": Array [
    Array [
      1,
      0,
      1,
    ],
    Array [
      0,
      1,
      2,
    ],
  ],
}
`);
		expect(() => matrix2.mmul(matrix1)).toThrow();
	});
});
