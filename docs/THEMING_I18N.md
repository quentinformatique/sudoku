# Theming & i18n

## Theme

- Theme tokens live in `src/app/theme`.
- Supports light/dark/system with configurable accent color.
- High-contrast mode increases text emphasis.
- UI uses a monochrome palette with subtle gradients for depth.

## Accent

- Palette presets in `src/features/settings/constants.ts`.
- Optional custom hex accent is validated before use.

## Typography

- Custom fonts: Space Grotesk (Regular/Medium/SemiBold).

## i18n

- `i18next` + `react-i18next` with `en` and `fr` locales.
- All UI strings live in `src/app/i18n/en.json` and `src/app/i18n/fr.json`.
- Language preference is persisted in SQLite settings.
