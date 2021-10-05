import { AbstractFactory } from '../../src/core/AbstractFactory';
import { FactoryBank } from '../../src/core/FactoryBank';

class TestFactory extends AbstractFactory {}

describe('FactoryBank', () => {
	test('Constructor', () => {
		const factory = new FactoryBank();

		expect(factory.getFactories()).toMatchInlineSnapshot(`Array []`);
	});

	test('register factory', () => {
		const bank = new FactoryBank();

		bank.registerFactory(new TestFactory('test'));
		expect(bank.getFactories()).toMatchInlineSnapshot(`
		Array [
		  TestFactory {
		    "bank": FactoryBank {
		      "factories": Object {
		        "test": [Circular],
		      },
		      "listeners": Object {},
		    },
		    "type": "test",
		  },
		]
	`);

		bank.registerFactory(new TestFactory('test'));
		expect(bank.getFactories().length).toMatchInlineSnapshot(`1`);

		bank.registerFactory(new TestFactory('test2'));
		expect(bank.getFactories().length).toMatchInlineSnapshot(`2`);

		const factory = bank.getFactory('test');
		expect(factory).toBeDefined();

		bank.clearFactories()
		expect(bank.getFactories().length).toMatchInlineSnapshot(`0`);
		expect(() => bank.getFactory('test')).toThrow();
	});
});
