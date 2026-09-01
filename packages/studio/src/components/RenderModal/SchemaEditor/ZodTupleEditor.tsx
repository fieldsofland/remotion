import {EasingVisualization, Slider} from 'dialkit';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {useZodIfPossible} from '../../get-zod-if-possible';
import {getDialKitLabel} from './dialkit-label';
import {Fieldset} from './Fieldset';
import {SchemaLabel} from './SchemaLabel';
import {SchemaArrayItemSeparationLine} from './SchemaSeparationLine';
import {SchemaVerticalGuide} from './SchemaVerticalGuide';
import {
	zodSafeParse,
	type AnyZodSchema,
	getUserFacingDescription,
	getZodSchemaType,
} from './zod-schema-type';
import {getTupleItems} from './zod-schema-type';
import type {JSONPath} from './zod-types';
import {ZodFieldValidation} from './ZodFieldValidation';
import type {UpdaterFunction} from './ZodSwitch';
import {ZodTupleItemEditor} from './ZodTupleItemEditor';

export const ZodTupleEditor: React.FC<{
	readonly schema: AnyZodSchema;
	readonly jsonPath: JSONPath;
	readonly value: unknown[];
	readonly setValue: UpdaterFunction<unknown[]>;
	readonly onRemove: null | (() => void);
	readonly mayPad: boolean;
}> = ({schema, jsonPath, setValue, value, onRemove, mayPad}) => {
	const onChange: UpdaterFunction<unknown[]> = useCallback(
		(
			updater: (oldV: unknown[]) => unknown[],
			{shouldSave}: {shouldSave: boolean},
		) => {
			setValue(updater, {shouldSave});
		},
		[setValue],
	);

	const zodValidation = useMemo(
		() => zodSafeParse(schema, value),
		[schema, value],
	);

	const [expanded, setExpanded] = useState(true);

	const tupleItems = getTupleItems(schema);
	const isEasingTuple =
		value.length === 4 &&
		tupleItems.length === 4 &&
		tupleItems.every((item) => getZodSchemaType(item) === 'number') &&
		typeof jsonPath[jsonPath.length - 1] === 'string' &&
		/ease|easing/i.test(String(jsonPath[jsonPath.length - 1]));
	const latestEase = useRef(value);
	latestEase.current = value;
	const onEasingChange = useCallback(
		(index: number, nextValue: number) => {
			const nextEase = [...latestEase.current];
			nextEase[index] = nextValue;
			latestEase.current = nextEase;
			setValue(() => nextEase, {shouldSave: false});
		},
		[setValue],
	);
	const saveEasing = useCallback(() => {
		setValue(() => latestEase.current, {shouldSave: true});
	}, [setValue]);

	const suffix = useMemo(() => {
		return expanded ? ' [' : ' [...] ';
	}, [expanded]);
	const z = useZodIfPossible();
	if (!z) {
		throw new Error('expected zod');
	}

	if (isEasingTuple) {
		const easing = value as [number, number, number, number];
		return (
			<Fieldset shouldPad={mayPad}>
				<div onPointerUp={saveEasing} onBlur={saveEasing}>
					<div className="remotion-dialkit-easing-editor">
						<div className="remotion-dialkit-easing-label">
							{getDialKitLabel(jsonPath)}
						</div>
						<EasingVisualization
							easing={{type: 'easing', duration: 1, ease: easing}}
						/>
						{(['x1', 'y1', 'x2', 'y2'] as const).map((label, index) => (
							<Slider
								key={label}
								label={label}
								value={easing[index]}
								onChange={(next) => onEasingChange(index, next)}
								min={label.startsWith('x') ? 0 : -1}
								max={label.startsWith('x') ? 1 : 2}
								step={0.01}
							/>
						))}
					</div>
					<ZodFieldValidation path={jsonPath} zodValidation={zodValidation} />
				</div>
			</Fieldset>
		);
	}

	return (
		<Fieldset shouldPad={mayPad}>
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
				}}
			>
				<SchemaLabel
					jsonPath={jsonPath}
					onRemove={onRemove}
					suffix={suffix}
					description={getUserFacingDescription(schema)}
					valid={zodValidation.success}
					handleClick={() => setExpanded(!expanded)}
				/>
			</div>

			{expanded ? (
				<SchemaVerticalGuide isRoot={false}>
					{value.map((child, i) => {
						return (
							// eslint-disable-next-line react/no-array-index-key
							<React.Fragment key={i}>
								<ZodTupleItemEditor
									onChange={onChange}
									value={child}
									tupleItems={tupleItems}
									index={i}
									jsonPath={jsonPath}
									mayPad={mayPad}
								/>
								<SchemaArrayItemSeparationLine
									schema={schema}
									index={i}
									onChange={onChange}
									isLast={i === value.length - 1}
									showAddButton={false}
								/>
							</React.Fragment>
						);
					})}
					{value.length === 0 ? (
						<SchemaArrayItemSeparationLine
							schema={schema}
							index={0}
							onChange={onChange}
							isLast
							showAddButton={false}
						/>
					) : null}
				</SchemaVerticalGuide>
			) : null}
			<ZodFieldValidation path={jsonPath} zodValidation={zodValidation} />
		</Fieldset>
	);
};
