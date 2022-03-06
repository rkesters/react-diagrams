import { Point } from '@projectstorm/geometry';
import { LinkModel } from '../../../src/entities/link/LinkModel';
import { PointModel, PointModelOptions } from '../../../src/entities/link/PointModel';
import { Toolkit } from '@projectstorm/react-canvas-core';
import { PortModel } from '../../../src/entities/port/PortModel';

describe('PointModel', () => {
	Toolkit.TESTING = true;
	Toolkit.TESTING_UID = 0;
	beforeEach(() => {
		Toolkit.TESTING = true;
		Toolkit.TESTING_UID = 0;
	});
	afterEach(() => {
		Toolkit.TESTING_UID = 0;
		Toolkit.TESTING = false;
	});
	test.each([
		{
			name: 'Minimal config',
			config: {
				link: new LinkModel({}),
				position: new Point(0, 0)
			},
			isConnectedToPort: false,
			isLocked: false
		},
		{
			name: 'Full config',
			config: {
				selected: false,
				extra: { foo: 'bar' },
				locked: false,
				link: new LinkModel({}),
				position: new Point(0, 0)
			},
			isConnectedToPort: false,
			isLocked: false
		},
		{
			name: 'Locked Parent',
			config: {
				link: new LinkModel({ locked: true }),
				position: new Point(0, 0)
			},
			isConnectedToPort: false,
			isLocked: true
		},
		{
			name: 'Locked',
			config: {
				link: new LinkModel({}),
				position: new Point(0, 0),
				locked: true
			},
			isConnectedToPort: false,
			isLocked: true
		},
		{
			name: 'Selected',
			config: {
				selected: true,
				link: new LinkModel({}),
				position: new Point(0, 0),
				locked: true
			},
			isConnectedToPort: false,
			isLocked: true
		},
		,
		{
			name: 'Connected',
			config: {
				selected: false,
				link: new LinkModel({}),
				position: new Point(0, 0),
				locked: false
			},
			isConnectedToPort: true,
			isLocked: false
		}
	])('All: $name', (tc) => {
		const { config, isConnectedToPort, isLocked } = tc;
		const model = new PointModel(config);

		if (isConnectedToPort) {
			const port = new PortModel({ name: 'source' });
			config.link.setPoints([model]);
			model.getParent().setSourcePort(port);
		}
		expect(model).toMatchSnapshot();
		expect(model.getLink()).toBe(config.link);
		expect(model.getParent()).toBe(config.link);
		expect(model.isConnectedToPort()).toBe(isConnectedToPort);
		expect(model.isLocked()).toBe(isLocked);

		isConnectedToPort
			? expect(model.getParent().getPoints()).toContain(model)
			: expect(model.getParent().getPoints()).not.toContain(model);

		model.remove();
		expect(model.getParent().getPoints()).not.toContain(model);
		model.setParent(null);
		model.remove();
	});
});
