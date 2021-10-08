import "@testing-library/jest-dom";
import { render, screen , cleanup} from '@testing-library/react';
import React from 'react';
import { CanvasEngine } from '../../../src/CanvasEngine';
import { SelectionBoxWidget } from '../../../src/entities/selection/SelectionBoxWidget';

describe('SelectionBoxWidget', () => {

	afterEach(cleanup);

	test('Create with rectangle', () => {
		const rect: DOMRect = {x: 10, y: 20, top: 20, right: 50, bottom: 70, left: 10,  width: 40, height: 50, toJSON: jest.fn()}
		const result = render(<SelectionBoxWidget rect={rect}></SelectionBoxWidget>);
		expect(result.container.querySelector('.css-j0yvm8')).toHaveStyle('top: 20px; left: 10px; width: 40px; height: 50px;');


	});

	test('Create with null', () => {
		const nullResult = render(<SelectionBoxWidget rect={null}></SelectionBoxWidget>);
		expect(nullResult.container.querySelector('.css-j0yvm8')).toBeNull();
	});
});
