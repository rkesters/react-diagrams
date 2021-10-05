import { BaseEvent, BaseObserver } from '../../src/core/BaseObserver';

describe('BaseObserver', () => {
	test('registerListener and deregisterListener', () => {
		const obs: BaseObserver = new BaseObserver();

		const listner = {
			eventWillFire(event: any) {
				console.log(event.firing);
				return;
			},
			eventDidFire(event: any) {
				console.log(event.firing);
				return;
			}
		};

		expect(obs.getListenerHandle(listner)).toBeFalsy();
		obs.registerListener(listner);
		expect(obs.getListenerHandle(listner)).toBeTruthy();
		expect(obs.deregisterListener(listner)).toBeTruthy();
		expect(obs.getListenerHandle(listner)).toBeFalsy();
		obs.registerListener(listner);
		expect(obs.deregisterListener(obs.getListenerHandle(listner))).toBeTruthy();
		expect(obs.getListenerHandle(listner)).toBeFalsy();
		obs.registerListener(listner);
		const handler = obs.getListenerHandle(listner);
		expect(handler).toBeDefined();
		handler.deregister();
		expect(obs.getListenerHandle(listner)).toBeFalsy();
		expect(obs.deregisterListener(listner)).toBeFalsy();

	});

	test('fire', () => {
		const obs: BaseObserver = new BaseObserver();

		const listner = {
			eventWillFire: jest.fn(),
			eventDidFire: jest.fn()
		};
		const listner2 = {
			eventWillFire: jest.fn() ,
			eventDidFire: jest.fn()
		};

		obs.registerListener(listner);
		obs.registerListener(listner2);

		obs.fireEvent({}, 'eventWillFire');

		expect(listner.eventWillFire).toHaveBeenCalledTimes(2);
		expect(listner2.eventWillFire).toHaveBeenCalledTimes(2);
		expect(listner.eventDidFire).toHaveBeenCalledTimes(1);
		expect(listner2.eventDidFire).toHaveBeenCalledTimes(1);
		obs.fireEvent({}, 'eventDidFire');

		expect(listner.eventWillFire).toHaveBeenCalledTimes(3);
		expect(listner2.eventWillFire).toHaveBeenCalledTimes(3);
		expect(listner.eventDidFire).toHaveBeenCalledTimes(3);
		expect(listner2.eventDidFire).toHaveBeenCalledTimes(3);

	});
});
