# Sudoku Noir

A minimal, offline-first Sudoku experience built with Expo, React Native, and TypeScript.

## Stack

- Expo + React Native
- React Navigation (tabs + stacks)
- Zustand
- SQLite via expo-sqlite
- i18next (EN + FR)

## Scripts

- `npm run start`
- `npm run lint`
- `npm run typecheck`
- `npm test`

## Tests

The Sudoku engine and repository logic are covered with Jest + ts-jest. SQLite is mocked in Jest, and repository tests run against an in-memory adapter to validate read/write behavior.

## Docs

See `/docs` for architecture, data model, engine notes, and theming/i18n.
