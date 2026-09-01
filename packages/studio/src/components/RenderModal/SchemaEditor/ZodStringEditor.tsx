import {TextControl} from 'dialkit';
import {useMemo} from 'react';
import React, {useCallback} from 'react';
import {useZodIfPossible} from '../../get-zod-if-possible';
import {getDialKitLabel} from './dialkit-label';
import {Fieldset} from './Fieldset';
import {zodSafeParse, type AnyZodSchema} from './zod-schema-type';
import type {JSONPath} from './zod-types';
import {ZodFieldValidation} from './ZodFieldValidation';
import type {UpdaterFunction} from './ZodSwitch';

const fullWidth: React.CSSProperties = {
	width: '100%',
};

export const ZodStringEditor: React.FC<{
	readonly schema: AnyZodSchema;
	readonly jsonPath: JSONPath;
	readonly value: string;
	readonly setValue: UpdaterFunction<string>;
	readonly onRemove: null | (() => void);
	readonly mayPad: boolean;
}> = ({jsonPath, value, setValue, schema, mayPad}) => {
	const z = useZodIfPossible();
	if (!z) {
		throw new Error('expected zod');
	}

	const zodValidation = useMemo(
		() => zodSafeParse(schema, value),
		[schema, value],
	);

	const onChange = useCallback(
		(next: string) => {
			setValue(() => next, {shouldSave: false});
		},
		[setValue],
	);

	const onBlur = useCallback(() => {
		setValue(() => value, {shouldSave: true});
	}, [setValue, value]);

	return (
		<Fieldset shouldPad={mayPad}>
			<div style={fullWidth} onBlur={onBlur}>
				<TextControl
					label={getDialKitLabel(jsonPath)}
					value={value}
					placeholder={jsonPath.join('.')}
					onChange={onChange}
				/>
				<ZodFieldValidation path={jsonPath} zodValidation={zodValidation} />
			</div>
		</Fieldset>
	);
};
