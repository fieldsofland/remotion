export const dialKitStudioStyles = `
body,
.css-reset,
.css-reset *,
.dialkit-root,
.dialkit-root *,
.dialkit-select-dropdown,
.dialkit-select-dropdown * {
  font-family: "OpenAI Sans", system-ui, -apple-system, sans-serif !important;
}

.dialkit-root {
  --dial-glass-bg: #171716;
  --dial-dropdown-bg: #1d1d1b;
  --dial-surface: rgba(255, 255, 255, 0.065);
  --dial-surface-hover: rgba(255, 255, 255, 0.1);
  --dial-surface-active: rgba(255, 255, 255, 0.16);
  --dial-surface-subtle: rgba(255, 255, 255, 0.075);
  --dial-border-hover: rgba(255, 255, 255, 0.28);
}

.dialkit-select-dropdown {
  --dial-glass-bg: #171716;
  --dial-dropdown-bg: #1d1d1b;
  --dial-surface-hover: rgba(255, 255, 255, 0.1);
  --dial-surface-active: rgba(255, 255, 255, 0.16);
}

.dialkit-root .dialkit-slider-label,
.dialkit-root .dialkit-slider-value,
.dialkit-root .dialkit-slider-input,
.dialkit-root .dialkit-toggle,
.dialkit-root .dialkit-text-input,
.dialkit-root .dialkit-color-control,
.dialkit-root .dialkit-select-trigger,
.dialkit-root .dialkit-select-label,
.dialkit-root .dialkit-select-value,
.dialkit-root .dialkit-segmented-button {
  font-size: 12px;
}

.dialkit-root button,
.dialkit-root input {
  font-size: 12px;
}

.dialkit-root .dialkit-folder-title {
  font-size: 13px;
}

.dialkit-root .dialkit-folder-title-root {
  font-size: 14px;
}

.dialkit-root .dialkit-slider-wrapper {
  min-height: var(--dial-row-height);
}

.dialkit-root .dialkit-slider {
  background: var(--dial-surface) !important;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.dialkit-root .dialkit-slider:hover {
  background: var(--dial-surface-hover) !important;
}

.dialkit-root .dialkit-slider-fill {
  background: var(--dial-surface-active) !important;
  border-right: 1px solid rgba(255, 255, 255, 0.52);
}

.dialkit-root .dialkit-slider-handle {
  width: 2px;
  opacity: 0.9 !important;
  transform: translateY(-50%) scaleX(1) !important;
  background: rgba(250, 248, 244, 0.96);
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.34);
}

.dialkit-root .dialkit-folder:not(.dialkit-folder-root) {
  border-color: rgba(255, 255, 255, 0.1);
}

.dialkit-root .dialkit-folder:not(.dialkit-folder-root) > .dialkit-folder-header {
  padding-left: 8px;
  padding-right: 8px;
}

.dialkit-root .dialkit-folder:not(.dialkit-folder-root) > .dialkit-folder-content > .dialkit-folder-inner {
  padding: 4px 8px 12px;
}

.dialkit-select-dropdown {
  padding: 6px;
}

.dialkit-select-option {
  padding: 9px 12px;
  font-size: 12px;
}

.dialkit-root .dialkit-folder-header:hover .dialkit-folder-title {
  color: rgba(255, 255, 255, 0.95);
}

.remotion-splitter-vertical {
  background: rgba(255, 255, 255, 0.035);
  cursor: col-resize;
  position: relative;
  transition: background 150ms;
}

.remotion-splitter-vertical:hover {
  background: rgba(255, 255, 255, 0.14);
}
`;
