import {expect, test} from 'bun:test';
import {
	getDialKitLabel,
	shouldOpenDialKitFolder,
} from '../components/RenderModal/SchemaEditor/dialkit-label';

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
