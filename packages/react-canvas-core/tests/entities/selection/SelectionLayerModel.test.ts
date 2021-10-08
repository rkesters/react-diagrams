
import { SelectionLayerModel } from '../../../src/entities/selection/SelectionLayerModel';


describe('SelectionLayerModel', () => {


	test('Constructor', () => {
		const model = new SelectionLayerModel();

		expect(model.getOptions()).toMatchSnapshot({id:expect.any(String)});

		expect(model.getChildModelFactoryBank()).toBeNull();

		const rect: DOMRect = {x: 10, y: 20, top: 20, right: 50, bottom: 70, left: 10,  width: 40, height: 50, toJSON: jest.fn()}
		model.setBox(rect);

		expect((model.box)).toEqual(rect);
	})

})