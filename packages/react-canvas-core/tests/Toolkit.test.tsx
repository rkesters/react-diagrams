import { Toolkit } from '../src/Toolkit';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import React from 'react';

describe('Toolkit', () => {
	const UUIDRegex = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

	test.each([
		{
			name: 'Get UID',
			TESTING: false,
			TESTING_UID: 0,
			count: 3,
			testValues: []
		},
		{
			name: 'Get Test UID, start at 0',
			TESTING: true,
			TESTING_UID: 0,
			count: 3,
			testValues: ['1', '2', '3']
		},
		{
			name: 'Get Test UID, start at 5',
			TESTING: true,
			TESTING_UID: 5,
			count: 3,
			testValues: ['6', '7', '8']
		}
	])('$name', (tc) => {
		Toolkit.TESTING = tc.TESTING;
		Toolkit.TESTING_UID = tc.TESTING_UID;

		const range = Array.from(Array(tc.count).keys());

		range.reduce((acc, r, index) => {
			const uid = Toolkit.UID();

			if (Toolkit.TESTING) {
				expect(uid).toEqual(tc.testValues[index]);
				expect(acc.includes(uid)).toEqual(false);
				return [...acc, uid];
			}

			expect(UUIDRegex.test(uid)).toEqual(true);
			expect(acc.includes(uid)).toEqual(false);
			return [...acc, uid];
		}, []);
	});

	test('closest', () => {
		const { container } = render(
			<article id="article">
				<div id="div-01">
					Here is div-01
					<div id="div-02">
						Here is div-02
						<div id="div-03">Here is div-03</div>
					</div>
				</div>
			</article>
		);

		const el = document.getElementById('div-03');

		expect(Toolkit.closest(el, '#div-02')).toHaveAttribute('id', 'div-02');
		expect(Toolkit.closest(el, "div div")).toHaveAttribute('id', 'div-03');
		expect(Toolkit.closest(el, 'article > div')).toHaveAttribute('id', 'div-01');
		expect(Toolkit.closest(el, ':not(div)')).toHaveAttribute('id', 'article');
		expect(Toolkit.closest(el, 'svg')).toBeNull();


		Element.prototype.closest = undefined;
		expect(Toolkit.closest(el, '#div-02')).toHaveAttribute('id', 'div-02');
		expect(Toolkit.closest(el, "div div")).toHaveAttribute('id', 'div-03');
		expect(Toolkit.closest(el, 'article > div')).toHaveAttribute('id', 'div-01');
		expect(Toolkit.closest(el, ':not(div)')).toHaveAttribute('id', 'article');
		expect(Toolkit.closest(el, 'svg')).toBeNull();
	});
});
