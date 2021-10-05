import { Point, Rectangle } from '@projectstorm/geometry';
import { BasePositionModel } from '../../src/core-models/BasePositionModel';

describe('BasePositionModel', () => {
	test('constructor', () => {
		let position = new BasePositionModel({});

		const origin = new Point(0, 0);
		expect(position.getPosition()).toEqual(origin);

		position = new BasePositionModel({ position: new Point(0, 1) });

		expect(position.getPosition()).toEqual(new Point(0, 1));

		position.setPosition(origin);
		expect(position.getPosition()).toEqual(origin);

		position.setPosition(1, 2);

		expect(position.getPosition()).toEqual(new Point(1, 2));

		expect(position.getBoundingBox()).toEqual(
			new Rectangle(position.getPosition(), position.getPosition(), position.getPosition(), position.getPosition())
		);

		const serial= position.serialize();
		expect(serial.x).toEqual(position.getPosition().x);
		expect(serial.y).toEqual(position.getPosition().y);

		const deSerial = {...serial , x: 0, y: 0};
		position.deserialize({data: deSerial}as any);
		expect(position.getPosition()).toEqual(origin);

		expect(position.getX()).toEqual(position.getPosition().x);
		expect(position.getY()).toEqual(position.getPosition().y);

	});
});
