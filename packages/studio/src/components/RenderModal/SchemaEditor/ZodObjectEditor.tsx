import {Folder} from 'dialkit';
import {useCallback} from 'react';
import React from 'react';
import {getDialKitLabel, shouldOpenDialKitFolder} from './dialkit-label';
import {Fieldset} from './Fieldset';
import {SchemaVerticalGuide} from './SchemaVerticalGuide';
import type {AnyZodSchema} from './zod-schema-type';
import {getObjectShape, getZodSchemaType} from './zod-schema-type';
import type {JSONPath} from './zod-types';
import type {UpdaterFunction} from './ZodSwitch';
import {ZodSwitch} from './ZodSwitch';

export type ObjectDiscrimatedUnionReplacement = {
	discriminator: string;
	markup: React.ReactNode;
};

export const ZodObjectEditor: React.FC<{
	readonly schema: AnyZodSchema;
	readonly jsonPath: JSONPath;
	readonly value: Record<string, unknown>;
	readonly setValue: UpdaterFunction<Record<string, unknown>>;
	readonly onRemove: null | (() => void);
	readonly mayPad: boolean;
	readonly discriminatedUnionReplacement: ObjectDiscrimatedUnionReplacement | null;
}> = ({
	schema,
	jsonPath,
	setValue,
	value,
	mayPad,
	discriminatedUnionReplacement,
}) => {
	const onChange: UpdaterFunction<Record<string, unknown>> = useCallback(
		(
			updater: (oldV: Record<string, unknown>) => Record<string, unknown>,
			{shouldSave}: {shouldSave: boolean},
		) => {
			setValue(updater, {shouldSave});
		},
		[setValue],
	);

	const typeName = getZodSchemaType(schema);
	if (typeName !== 'object') {
		throw new Error('expected object');
	}

	const shape = getObjectShape(schema);
	const keys = Object.keys(shape);

	const isRoot = jsonPath.length === 0;

	const fields = (
		<Fieldset shouldPad={!isRoot && mayPad}>
			<SchemaVerticalGuide isRoot={isRoot}>
				{keys.map((key) => {
					if (
						discriminatedUnionReplacement &&
						key === discriminatedUnionReplacement.discriminator
					) {
						return discriminatedUnionReplacement.markup;
					}

					return (
						<React.Fragment key={key}>
							<ZodSwitch
								mayPad
								jsonPath={[...jsonPath, key]}
								schema={shape[key]}
								value={value[key]}
								setValue={(val, {shouldSave}) => {
									onChange(
										(oldVal) => {
											return {
												...oldVal,
												[key]:
													typeof val === 'function' ? val(oldVal[key]) : val,
											};
										},
										{shouldSave},
									);
								}}
								onRemove={null}
							/>
						</React.Fragment>
					);
				})}
			</SchemaVerticalGuide>
		</Fieldset>
	);

	if (isRoot) {
		return fields;
	}

	return (
		<Folder
			title={getDialKitLabel(jsonPath)}
			defaultOpen={shouldOpenDialKitFolder(jsonPath)}
			inline
		>
			{fields}
		</Folder>
	);
};
