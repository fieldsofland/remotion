import {Slider} from 'dialkit';
import {useMemo} from 'react';
import React, {useCallback, useRef} from 'react';
import {getDialKitLabel} from './dialkit-label';
import {Fieldset} from './Fieldset';
import {
	getDialKitNumberConstraints,
	snapDialKitNumber,
} from './zod-number-constraints';
import {zodSafeParse, type AnyZodSchema} from './zod-schema-type';
import type {JSONPath} from './zod-types';
import {ZodFieldValidation} from './ZodFieldValidation';
import type {UpdaterFunction} from './ZodSwitch';

const fullWidth: React.CSSProperties = {
	width: '100%',
};

export const ZodNumberEditor: React.FC<{
	readonly schema: AnyZodSchema;
	readonly jsonPath: JSONPath;
	readonly value: number;
	readonly setValue: UpdaterFunction<number>;
	readonly onRemove: null | (() => void);
	readonly mayPad: boolean;
}> = ({jsonPath, value, schema, setValue, mayPad}) => {
	const initialValue = useRef(value).current;
	const latestValue = useRef(value);
	latestValue.current = value;
	const constraints = useMemo(
		() => getDialKitNumberConstraints({schema, value: initialValue}),
		[initialValue, schema],
	);
	const onNumberChange = useCallback(
		(newValue: number) => {
			const snapped = snapDialKitNumber({...constraints, value: newValue});
			latestValue.current = snapped;
			setValue(() => snapped, {shouldSave: false});
		},
		[constraints, setValue],
	);

	const saveNumber = useCallback(() => {
		setValue(() => latestValue.current, {shouldSave: true});
	}, [setValue]);

	const zodValidation = useMemo(
		() => zodSafeParse(schema, value),
		[schema, value],
	);

	return (
		<Fieldset shouldPad={mayPad}>
			<div style={fullWidth} onPointerUp={saveNumber} onBlur={saveNumber}>
				<Slider
					label={getDialKitLabel(jsonPath)}
					value={value}
					onChange={onNumberChange}
					min={constraints.min}
					max={constraints.max}
					step={constraints.step}
				/>
				<ZodFieldValidation path={jsonPath} zodValidation={zodValidation} />
			</div>
		</Fieldset>
	);
};
