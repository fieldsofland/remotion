import {ColorControl} from 'dialkit';
import React, {useCallback, useMemo, useRef} from 'react';
import {getDialKitLabel} from './dialkit-label';
import {Fieldset} from './Fieldset';
import {zodSafeParse, type AnyZodSchema} from './zod-schema-type';
import type {JSONPath} from './zod-types';
import {ZodFieldValidation} from './ZodFieldValidation';
import type {UpdaterFunction} from './ZodSwitch';

const fullWidth: React.CSSProperties = {
	width: '100%',
};

export const ZodColorEditor: React.FC<{
	readonly schema: AnyZodSchema;
	readonly jsonPath: JSONPath;
	readonly value: string;
	readonly setValue: UpdaterFunction<string>;
	readonly onRemove: null | (() => void);
	readonly mayPad: boolean;
}> = ({jsonPath, value, setValue, schema, mayPad}) => {
	const latestValue = useRef(value);
	latestValue.current = value;
	const localValue = useMemo(
		() => zodSafeParse(schema, value),
		[schema, value],
	);

	const onPickerChange = useCallback(
		(next: string) => {
			latestValue.current = next;
			setValue(() => next, {shouldSave: false});
		},
		[setValue],
	);

	const saveColor = useCallback(() => {
		setValue(() => latestValue.current, {shouldSave: true});
	}, [setValue]);

	return (
		<Fieldset shouldPad={mayPad}>
			<div style={fullWidth} onPointerUp={saveColor} onBlur={saveColor}>
				<ColorControl
					label={getDialKitLabel(jsonPath)}
					value={value}
					onChange={onPickerChange}
				/>
				<ZodFieldValidation path={jsonPath} zodValidation={localValue} />
			</div>
		</Fieldset>
	);
};
