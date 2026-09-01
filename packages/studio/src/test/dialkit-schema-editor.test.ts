import {expect, test} from 'bun:test';
import {z} from 'zod';
import {
	getDialKitLabel,
	shouldOpenDialKitFolder,
} from '../components/RenderModal/SchemaEditor/dialkit-label';
import {
	getDialKitNumberConstraints,
	snapDialKitNumber,
} from '../components/RenderModal/SchemaEditor/zod-number-constraints';

test('formats schema paths as DialKit labels', () => {
	expect(getDialKitLabel([])).toBe('Props');
	expect(getDialKitLabel(['cameraSettings'])).toBe('Camera Settings');
	expect(getDialKitLabel(['render_options'])).toBe('Render options');
	expect(getDialKitLabel(['items', 1])).toBe('Item 2');
});

test('opens only the top-level settings folder by default', () => {
	expect(shouldOpenDialKitFolder(['settings'])).toBe(true);
	expect(shouldOpenDialKitFolder(['animation'])).toBe(false);
	expect(shouldOpenDialKitFolder(['props', 'settings'])).toBe(false);
});

test('gives unbounded integers a useful DialKit slider range', () => {
	const constraints = getDialKitNumberConstraints({
		schema: z.number().int(),
		value: 79083,
	});

	expect(constraints.step).toBe(1);
	expect(constraints.min).toBeLessThanOrEqual(79083);
	expect(constraints.max).toBeGreaterThanOrEqual(79083);
});

test('fills in a missing slider bound without replacing schema constraints', () => {
	const constraints = getDialKitNumberConstraints({
		schema: z.number().min(1).step(0.1),
		value: 14,
	});

	expect(constraints.min).toBe(1);
	expect(constraints.max).toBeGreaterThan(14);
	expect(constraints.step).toBe(0.1);
});

test('snaps numeric slider output before Zod validation', () => {
	expect(snapDialKitNumber({value: 57.8, min: 1, max: 64, step: 1})).toBe(58);
	expect(snapDialKitNumber({value: 0.337, min: 0, max: 1, step: 0.01})).toBe(
		0.34,
	);
});
