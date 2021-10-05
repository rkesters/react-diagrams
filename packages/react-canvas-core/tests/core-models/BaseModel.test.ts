import { BaseEntity } from '../../src/core-models/BaseEntity';
import { BaseModel, BaseModelOptions } from '../../src/core-models/BaseModel';
import { CanvasModel } from '../../src/entities/canvas/CanvasModel';

describe('BaseModel', () => {
	test('constructor', () => {
		const model = new BaseModel({});

		expect(model.getID()).toBeDefined();
		expect(model.getOptions().id).toEqual(model.getID());

		const model2 = new BaseModel({ locked: true });

		expect(model2.getID()).toBeDefined();
		expect(model2.getOptions().id).toEqual(model2.getID());
		expect(model2.isLocked()).toBeDefined();
		expect(model2.getOptions().locked).toEqual(model2.isLocked());
	});

	test('selection', () => {
		const model = new BaseModel({});
		expect(model.getOptions().id).toEqual(model.getID());

		model.setSelected();
		expect(model.getOptions().selected).toBeTruthy();
		model.setSelected(false);
		expect(model.getOptions().selected).toBeFalsy();
		expect(model.isSelected()).toEqual(model.getOptions().selected);

		expect(model.getSelectionEntities()).toBeDefined();
		expect(model.getSelectionEntities()[0]).toEqual(model);
	});

	test('parent', () => {
		const model = new BaseModel({});
		const parent: BaseEntity = new BaseEntity();

		expect(model.getParentCanvasModel()).toEqual(null);
		model.setParent(parent);

		expect(model.getParent()).toEqual(parent);

		expect(model.getParentCanvasModel()).toEqual(null);

		const canvas: BaseEntity = new CanvasModel();
		model.setParent(canvas);
		expect(model.getParentCanvasModel()).toEqual(model.getParent());

		const base: BaseModel = new BaseModel({});
		base.setParent(canvas);
		model.setParent(base);
		expect(model.getParentCanvasModel()).toEqual(base.getParentCanvasModel());

		base.setLocked(true);
		model.setLocked(false);
		expect(model.isLocked()).toBeTruthy();
	});

	test('serialize', () => {
		const model = new BaseModel({});

		model.setLocked();
		expect(model.isLocked()).toBeTruthy();

		const serial = model.serialize();
		expect(serial.id).toBeDefined();
		expect(serial.locked).toBeTruthy();
		expect(serial.selected).toBeUndefined();
		expect(serial.type).toBeUndefined();

		const serial2 = {
			extras: undefined,
			id: 'a32fea83-c212-4b43-8533-581e5f518c3f',
			locked: false,
			selected: true,
			type: 'GOD'
		};
		model.deserialize({ data: serial2 } as any);
		const result = model.serialize();
		expect(result.id).toBeDefined();
		expect(result.locked).not.toBeTruthy();
		expect(result.selected).toBeTruthy();
		expect(result.type).toBeUndefined();
	});

});
