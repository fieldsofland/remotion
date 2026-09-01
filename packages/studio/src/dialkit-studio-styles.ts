export const dialKitStudioStyles = `
.dialkit-root {
  --dial-surface: rgba(255, 255, 255, 0.08);
  --dial-surface-hover: rgba(255, 255, 255, 0.13);
  --dial-surface-active: rgba(116, 139, 255, 0.3);
  --dial-surface-subtle: rgba(255, 255, 255, 0.1);
  --dial-border-hover: rgba(150, 168, 255, 0.58);
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
  border-right: 1px solid rgba(173, 185, 255, 0.65);
}

.dialkit-root .dialkit-slider-handle {
  width: 2px;
  opacity: 0.9 !important;
  transform: translateY(-50%) scaleX(1) !important;
  background: rgba(225, 230, 255, 0.96);
  box-shadow: 0 0 8px rgba(139, 158, 255, 0.65);
}

.dialkit-root .dialkit-folder:not(.dialkit-folder-root) {
  border-color: rgba(255, 255, 255, 0.1);
}

.dialkit-root .dialkit-folder-header:hover .dialkit-folder-title {
  color: rgba(255, 255, 255, 0.95);
}
`;
