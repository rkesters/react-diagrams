import { CanvasEngine } from '../../../src/CanvasEngine';
import { SelectionBoxLayerFactory } from '../../../src/entities/selection/SelectionBoxLayerFactory';
import { SelectionLayerModel } from '../../../src/entities/selection/SelectionLayerModel';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import  "@testing-library/jest-dom";

describe('SelectionBoxLayerFactory', () => {
	test('Generate Functions', () => {
		const factory = new SelectionBoxLayerFactory();
		const engine = new CanvasEngine();
		factory.setDiagramEngine(engine);

		const layer = factory.generateModel({} as any);
		expect(layer).toEqual(expect.any(SelectionLayerModel));
		
		const rect: DOMRect = {x: 10, y: 20, top: 20, right: 50, bottom: 70, left: 10,  width: 40, height: 50, toJSON: jest.fn()}
		const result = render(<> {factory.generateReactWidget({ model: { box: rect } } as any)} </>);
		expect(result.container.querySelector('.css-j0yvm8')).toHaveStyle('top: 20px; left: 10px; width: 40px; height: 50px;');
	});
});
