import { defaults } from 'lodash';
import { WheelEvent } from 'react';
import { mocked } from 'ts-jest/utils';
import { ZoomCanvasAction, ZoomCanvasActionOptions } from '../../src/actions/ZoomCanvasAction';
import { CanvasEngine } from '../../src/CanvasEngine';
import { ActionEvent } from '../../src/core-actions/Action';
import { CanvasModel } from '../../src/entities/canvas/CanvasModel';

interface zoomEventOptions {
	deltaY: number;
	clientX: number;
	clientY: number;
	ctrlKey?: boolean;
	boundingBox: { width: number; height: number; left: number; top: number };
}

const generateZoomEvent = (opts: zoomEventOptions): ActionEvent<WheelEvent> => {
	const event: WheelEvent = {
		deltaY: opts.deltaY,
		clientX: opts.clientX,
		clientY: opts.clientY,

		currentTarget: {
			getBoundingClientRect: jest.fn().mockImplementation((): DOMRect => {
				return { ...opts.boundingBox } as DOMRect;
			})
		},
		stopPropagation: jest.fn()
	} as any;
	return { event } as ActionEvent<WheelEvent>;
};
interface TestCases {
	options?: ZoomCanvasActionOptions;
	events: zoomEventOptions[];
	name: string;
}

const testCases: TestCases[] = [
	{
		name: 'inverseZoom True',
		options: { inverseZoom: true },
		events: [{ deltaY: 20, clientX: 10, clientY: 10, boundingBox: { width: 500, height: 500, left: 0, top: 0 } }]
	},
	{
		name: 'inverseZoom false',
		options: { inverseZoom: false },
		events: [{ deltaY: 20, clientX: 10, clientY: 10, boundingBox: { width: 500, height: 500, left: 0, top: 0 } }]
	},
	{
		name: 'inverseZoom undefined',
		options: {},
		events: [{ deltaY: 20, clientX: 10, clientY: 10, boundingBox: { width: 500, height: 500, left: 0, top: 0 } }]
	},
	{
		name: 'Options undefined',
		events: [{ deltaY: 20, clientX: 10, clientY: 10, boundingBox: { width: 500, height: 500, left: 0, top: 0 } }]
	},
	{
		name: 'inverseZoom True, ctrlKey true',
		options: { inverseZoom: true },
		events: [
			{
				deltaY: 20.123,
				ctrlKey: true,
				clientX: 10,
				clientY: 10,
				boundingBox: { width: 500, height: 500, left: 0, top: 0 }
			}
		]
	},
	{
		name: 'inverseZoom false',
		options: { inverseZoom: false },
		events: [
			{
				deltaY: 20.123,
				ctrlKey: true,
				clientX: 10,
				clientY: 10,
				boundingBox: { width: 500, height: 500, left: 0, top: 0 }
			}
		]
	},
	{
		name: 'inverseZoom undefined',
		options: {},
		events: [
			{
				deltaY: 20.123,
				ctrlKey: true,
				clientX: 10,
				clientY: 10,
				boundingBox: { width: 500, height: 500, left: 0, top: 0 }
			}
		]
	},
	{
		name: 'Options undefined',
		events: [
			{
				deltaY: 20.123,
				ctrlKey: true,
				clientX: 10,
				clientY: 10,
				boundingBox: { width: 500, height: 500, left: 0, top: 0 }
			}
		]
	}
];

describe('ZoomCanvasAction', () => {
	test.each<TestCases>(testCases)('Constructor: $name', (tc) => {
		const action: ZoomCanvasAction = new ZoomCanvasAction(tc.options);
		expect(action.zoomCanvasActionOpions).toMatchSnapshot();
	});

	test.each<TestCases>(testCases)('Fire action: $name', (tc) => {
		const action: ZoomCanvasAction = new ZoomCanvasAction(tc.options);
		expect(action.zoomCanvasActionOpions).toMatchSnapshot();

		const engine = new CanvasEngine();
		const cModel = new CanvasModel();
		engine.setModel(cModel);
		action.setEngine(engine);

		expect(cModel.getOffsetX()).toMatchSnapshot();
		expect(cModel.getOffsetY()).toMatchSnapshot();

		const event = generateZoomEvent(tc.events[0]);
		action.options.fire(event);

		expect(cModel.getOffsetX()).toMatchSnapshot();
		expect(cModel.getOffsetY()).toMatchSnapshot();
	});
});
