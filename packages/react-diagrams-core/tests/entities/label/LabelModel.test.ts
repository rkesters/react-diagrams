
import { LabelModel } from '../../../src/entities/label/LabelModel';

describe('LabelModel', () => {

	test.each([
		{
			name: 'default',
			options: { offsetX: 0, offsetY: 0 },
		},
		{
			name: "Undefined Options",
			options: undefined,
			shouldThrow: true
		},
		{
			name: "Missing Offset",
			options: {},
		}
	])('constructor: $name', (tc) => {

		if (tc.shouldThrow) {
			expect(() => new LabelModel(tc.options)).toThrowError();
			return;

		}
		const labelModel = new LabelModel(tc.options);
		expect(labelModel.getOptions()).toMatchSnapshot({ id: expect.any(String) });


	});

	test.each([
		{
			name: 'default',
			options: { offsetX: 0, offsetY: 0 },
			deserial: { extras: {}, id: 'god', locked: true, offsetX: 10, offsetY: 20, selected: true, type: 'test'}
		},
	])('serialize: $name', (tc) => {
		const labelModel = new LabelModel(tc.options);
		const serial = labelModel.serialize();

		expect(serial).toMatchSnapshot({ id: expect.any(String) });

		labelModel.deserialize({ data: {...serial, ...tc.deserial} } as any);

		expect(labelModel.serialize()).toMatchSnapshot();
	});
});
