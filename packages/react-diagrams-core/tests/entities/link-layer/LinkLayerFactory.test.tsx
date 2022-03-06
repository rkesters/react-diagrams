import { LinkLayerFactory } from '../../../src/entities/link-layer/LinkLayerFactory';
import { LinkLayerModel } from '../../../src/entities/link-layer/LinkLayerModel';
import { render, waitFor } from '@testing-library/react';
import React from 'react';

describe('LinkLayerFactory', () => {
	test('generateModel', () => {
		const factory = new LinkLayerFactory();

		const model = factory.generateModel({});

		expect(model).toBeInstanceOf(LinkLayerModel);
	});

	test('generateReactWidget', () => {
		const factory = new LinkLayerFactory();

		const model = factory.generateModel({});

		const widget = render(factory.generateReactWidget({ model }), { wrapper: ({ children }) => <svg>{children}</svg> });

		expect(widget.baseElement).toMatchSnapshot();
	});
});
