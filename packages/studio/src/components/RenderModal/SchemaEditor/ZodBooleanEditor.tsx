import {Toggle} from 'dialkit';
import React, {useCallback} from 'react';
import {getDialKitLabel} from './dialkit-label';
import {Fieldset} from './Fieldset';
import type {AnyZodSchema} from './zod-schema-type';
import type {JSONPath} from './zod-types';
import type {UpdaterFunction} from './ZodSwitch';

const fullWidth: React.CSSProperties = {
	width: '100%',
};

export const ZodBooleanEditor: React.FC<{
	readonly jsonPath: JSONPath;
	readonly value: boolean;
	readonly setValue: UpdaterFunction<boolean>;
	readonly onRemove: null | (() => void);
	readonly mayPad: boolean;
	readonly schema: AnyZodSchema;
}> = ({jsonPath, value, setValue, mayPad}) => {
	const onToggle = useCallback(
		(checked: boolean) => {
			setValue(() => checked, {shouldSave: true});
		},
		[setValue],
	);

	return (
		<Fieldset shouldPad={mayPad}>
			<div style={fullWidth}>
				<Toggle
					label={getDialKitLabel(jsonPath)}
					checked={value}
					onChange={onToggle}
				/>
			</div>
		</Fieldset>
	);
};
