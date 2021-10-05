import { BaseEntity, DeserializeEvent } from '../../src/core-models/BaseEntity';

describe('BaseEntity', () => {
	test('constructor', () => {
		const entity = new BaseEntity();

		expect(entity.getOptions()).toBeDefined();
		expect(entity.getID().length).toMatchInlineSnapshot(`36`);
	});

	test('setLock', () => {
		const entity = new BaseEntity();

		expect(entity.isLocked()).toBeFalsy();
		entity.setLocked(true);
		expect(entity.isLocked()).toBeTruthy();
		entity.setLocked(false);
		expect(entity.isLocked()).toBeFalsy();
		entity.setLocked();
		expect(entity.isLocked()).toBeTruthy();


	});
	test('serialize', () => {
		const entity = new BaseEntity();

		const serial = entity.serialize();

		expect(serial).toBeDefined();
		entity.deserialize({ data: serial } as any);
		expect(entity.getID()).toEqual(serial.id);
		expect(entity.isLocked()).toEqual(serial.locked);

		serial.id = 'test';
		serial.locked = false;
		entity.deserialize({ data: serial } as any);
		expect(entity.getID()).toEqual(serial.id);
		expect(entity.isLocked()).toEqual(serial.locked);
	});

	test('clone', () => {
		const entity = new BaseEntity();

		const clone = entity.clone();
		expect(clone).toBeDefined();
		expect(clone.getID()).toBeDefined();
		expect(clone.getID()).not.toEqual(entity.getID());

		const clone2 = entity.clone({[entity.getID()]: clone});
		expect(clone2).toBeDefined();
		expect(clone2.getID()).toBeDefined();
		expect(clone2.getID()).toEqual(clone.getID());
	});
});
