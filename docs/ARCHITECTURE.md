# Architecture

Sudoku Noir is structured around feature folders, with shared app infrastructure (theme, i18n, navigation) in `src/app`.

## High-level flow

```mermaid
graph TD
  App[App.tsx] --> Bootstrap[AppBootstrap]
  Bootstrap --> Providers[AppProviders]
  Providers --> Nav[RootNavigator]
  Nav --> Home[Home]
  Nav --> Play[Play Stack]
  Nav --> Stats[Stats Stack]
  Nav --> Settings[Settings Stack]
  Play --> Game[Game Screen]
  Game --> Store[Zustand Stores]
  Store --> Repo[SQLite Repositories]
  Repo --> DB[(expo-sqlite)]
  Game --> Engine[Sudoku Engine]
```

## Layers

- UI: screens and UI kit components in `src/features` and `src/components`.
- State: `zustand` stores for game and settings.
- Data: SQLite repositories and migrations in `src/data`.
- Engine: Sudoku generator/solver in `src/features/game/engine`.

## Navigation

- Bottom tabs: Home, Play, Stats, Settings.
- Play stack: New Game → Game, Continue → Game.
- Stats stack: Statistics → History.
- Settings stack: Settings → About/Help/Learning/Privacy/Terms/Licenses.
