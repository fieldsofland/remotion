import type {JSONPath} from './zod-types';

export const shouldUseDialKitColor = ({
	jsonPath,
	value,
}: {
	readonly jsonPath: JSONPath;
	readonly value: string;
}): boolean => {
	const key = String(jsonPath[jsonPath.length - 1] ?? '');
	return (
		/color|colour|tint/i.test(key) && /^#[\da-f]{6}([\da-f]{2})?$/i.test(value)
	);
};
