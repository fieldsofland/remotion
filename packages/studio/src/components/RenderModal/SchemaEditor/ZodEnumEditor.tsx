import {SelectControl} from 'dialkit';
import React, {useMemo} from 'react';
import {useCallback} from 'react';
import {getDialKitLabel} from './dialkit-label';
import {Fieldset} from './Fieldset';
import {zodSafeParse, type AnyZodSchema} from './zod-schema-type';
import {getEnumValues} from './zod-schema-type';
import type {JSONPath} from './zod-types';
import {ZodFieldValidation} from './ZodFieldValidation';
import type {UpdaterFunction} from './ZodSwitch';

const container: React.CSSProperties = {
	width: '100%',
};

export const ZodEnumEditor: React.FC<{
	readonly schema: AnyZodSchema;
	readonly jsonPath: JSONPath;
	readonly value: string;
	readonly setValue: UpdaterFunction<string>;
	readonly onRemove: null | (() => void);
	readonly mayPad: boolean;
}> = ({schema, jsonPath, setValue, value, mayPad}) => {
	const onChange: UpdaterFunction<string> = useCallback(
		(
			updater: (oldV: string) => string,
			{shouldSave}: {shouldSave: boolean},
		) => {
			setValue(updater, {shouldSave});
		},
		[setValue],
	);

	const enumValues = getEnumValues(schema);

	const zodValidation = useMemo(
		() => zodSafeParse(schema, value),
		[schema, value],
	);

	return (
		<Fieldset shouldPad={mayPad}>
			<div style={container}>
				<SelectControl
					label={getDialKitLabel(jsonPath)}
					value={value}
					options={enumValues}
					onChange={(next) => onChange(() => next, {shouldSave: true})}
				/>
			</div>
			<ZodFieldValidation path={jsonPath} zodValidation={zodValidation} />
		</Fieldset>
	);
};
