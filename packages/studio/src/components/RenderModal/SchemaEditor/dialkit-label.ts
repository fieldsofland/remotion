import type {JSONPath} from './zod-types';

export const getDialKitLabel = (jsonPath: JSONPath): string => {
	const key = jsonPath.at(-1);
	if (typeof key === 'number') {
		return `Item ${key + 1}`;
	}

	if (!key) {
		return 'Props';
	}

	return key
		.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
		.replace(/[-_]+/g, ' ')
		.replace(/^./, (character) => character.toUpperCase());
};

export const shouldOpenDialKitFolder = (jsonPath: JSONPath): boolean => {
	return jsonPath.length === 1 && jsonPath[0] === 'settings';
};
