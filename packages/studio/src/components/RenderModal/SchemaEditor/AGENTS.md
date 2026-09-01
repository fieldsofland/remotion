# DialKit schema editor

This fork renders common Zod composition props with DialKit while retaining Remotion's schema validation, JSON fallback, and save-default-props pipeline.

## Adding or changing controls

- Use DialKit components for scalar controls: `Slider`, `Toggle`, `TextControl`, `ColorControl`, and `SelectControl`.
- Keep `ZodSwitch` as the schema dispatcher. Unsupported and structural Zod types must continue through the existing Remotion editors.
- Use `getDialKitLabel()` for field labels so camelCase, snake_case, and kebab-case props remain readable.
- Render Zod objects with DialKit's `Folder`. The root folder is `Props`; a top-level `settings` object starts expanded. Other nested objects start collapsed.
- Preserve `ZodFieldValidation` after each DialKit control.
- Send `{shouldSave: false}` while a continuous value changes. Send `{shouldSave: true}` on pointer release or blur. Discrete controls such as toggles and selects save immediately.
- Do not remove the JSON editor. It is the escape hatch for schema types DialKit does not represent.
- After changing the DialKit version, run `bun run embed-dialkit-styles` from `packages/studio` and commit the generated stylesheet module.
- Keep Studio-specific contrast and layout fixes in `src/dialkit-studio-styles.ts`. Do not edit the generated DialKit stylesheet.

## Verification

Run these commands from the repository root:

```bash
bun install
bunx turbo run lint test make --filter='@remotion/studio'
```

Then start `packages/example` and inspect a composition with nested objects and enums. Confirm that:

- `Props` and `Settings` collapse independently.
- Enum fields render as dropdowns.
- Number, boolean, text, and color edits update the preview.
- Saving default props still rewrites the inline `defaultProps` object.
- Switching to JSON preserves the same values.

## Updating from upstream

Keep this integration as one focused commit. Rebase it onto an upstream Remotion tag, resolve conflicts only inside the schema editor and Studio package wiring, then repeat the verification steps above.
