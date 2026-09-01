import type {AnyZodSchema} from './zod-schema-type';
import {getZodDef, isZodV3Schema} from './zod-schema-type';

export const getZodNumberMinimum = (schema: AnyZodSchema): number => {
	const {checks} = getZodDef(schema);
	if (!checks) return -Infinity;

	if (isZodV3Schema(schema)) {
		// v3: {kind: "min", value: 0, inclusive: true}
		const minCheck = checks.find((c: {kind: string}) => c.kind === 'min');
		if (!minCheck || !minCheck.inclusive) return -Infinity;
		return minCheck.value;
	}

	// v4: check objects with _zod.def = {check: "greater_than", value: 0, inclusive: true}
	for (const c of checks) {
		const def = c._zod?.def;
		if (def?.check === 'greater_than' && def.inclusive) {
			return def.value;
		}
	}

	return -Infinity;
};

export const getZodNumberMaximum = (schema: AnyZodSchema): number => {
	const {checks} = getZodDef(schema);
	if (!checks) return Infinity;

	if (isZodV3Schema(schema)) {
		// v3: {kind: "max", value: 100, inclusive: true}
		const maxCheck = checks.find((c: {kind: string}) => c.kind === 'max');
		if (!maxCheck || !maxCheck.inclusive) return Infinity;
		return maxCheck.value;
	}

	// v4: check objects with _zod.def = {check: "less_than", value: 100, inclusive: true}
	for (const c of checks) {
		const def = c._zod?.def;
		if (def?.check === 'less_than' && def.inclusive) {
			return def.value;
		}
	}

	return Infinity;
};

export const getZodNumberStep = (schema: AnyZodSchema): number | undefined => {
	const {checks} = getZodDef(schema);
	if (!checks) return undefined;

	if (isZodV3Schema(schema)) {
		// v3: {kind: "multipleOf", value: 5}
		const multipleStep = checks.find(
			(c: {kind: string}) => c.kind === 'multipleOf',
		);
		if (!multipleStep) return undefined;
		return multipleStep.value;
	}

	// v4: check objects with _zod.def = {check: "multiple_of", value: 5}
	for (const c of checks) {
		const def = c._zod?.def;
		if (def?.check === 'multiple_of') {
			return def.value;
		}
	}

	return undefined;
};

export const isZodNumberInteger = (schema: AnyZodSchema): boolean => {
	const {checks} = getZodDef(schema);
	if (!checks) return false;

	if (isZodV3Schema(schema)) {
		return checks.some((c: {kind: string}) => c.kind === 'int');
	}

	return checks.some(
		(c: {_zod?: {def?: {check?: string; format?: string}}}) => {
			const def = c._zod?.def;
			return (
				def?.check === 'number_format' &&
				typeof def.format === 'string' &&
				def.format.endsWith('int')
			);
		},
	);
};

export const getDialKitNumberConstraints = ({
	schema,
	value,
}: {
	readonly schema: AnyZodSchema;
	readonly value: number;
}): {min: number; max: number; step: number} => {
	const schemaMinimum = getZodNumberMinimum(schema);
	const schemaMaximum = getZodNumberMaximum(schema);
	const step =
		getZodNumberStep(schema) ?? (isZodNumberInteger(schema) ? 1 : 0.01);
	const finiteValue = Number.isFinite(value) ? value : 0;
	const hasMinimum = Number.isFinite(schemaMinimum);
	const hasMaximum = Number.isFinite(schemaMaximum);
	const span = Math.max(Math.abs(finiteValue), step * 100, 10);

	if (hasMinimum && hasMaximum) {
		return {min: schemaMinimum, max: schemaMaximum, step};
	}

	if (hasMinimum) {
		return {
			min: schemaMinimum,
			max: Math.max(schemaMinimum + span, finiteValue + span),
			step,
		};
	}

	if (hasMaximum) {
		return {
			min: Math.min(schemaMaximum - span, finiteValue - span),
			max: schemaMaximum,
			step,
		};
	}

	return {
		min: finiteValue - span,
		max: finiteValue + span,
		step,
	};
};

export const snapDialKitNumber = ({
	value,
	min,
	max,
	step,
}: {
	readonly value: number;
	readonly min: number;
	readonly max: number;
	readonly step: number;
}): number => {
	const precision = Math.max(0, (String(step).split('.')[1] ?? '').length);
	const snapped = min + Math.round((value - min) / step) * step;
	return Number(Math.min(max, Math.max(min, snapped)).toFixed(precision));
};
