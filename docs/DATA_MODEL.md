# Data Model

SQLite is the source of truth for offline-first storage. The schema is versioned with a `schema_version` table and migrations.

## Tables

### schema_version
- `version` INTEGER NOT NULL

### settings
- `key` TEXT PRIMARY KEY
- `value` TEXT NOT NULL (JSON)

### games
- `id` TEXT PRIMARY KEY
- `difficulty` TEXT NOT NULL
- `puzzle` TEXT NOT NULL (81-char grid)
- `solution` TEXT NOT NULL (81-char grid)
- `status` TEXT NOT NULL (`active`, `completed`, `abandoned`)
- `started_at` INTEGER NOT NULL (epoch ms)
- `updated_at` INTEGER NOT NULL (epoch ms)
- `completed_at` INTEGER NULL (epoch ms)
- `duration_sec` INTEGER NOT NULL
- `mistakes` INTEGER NOT NULL
- `moves` INTEGER NOT NULL

### game_state
- `game_id` TEXT PRIMARY KEY
- `state_json` TEXT NOT NULL (grid, notes, elapsed, mode)

## Relationships

- `game_state.game_id` references `games.id` (cascade delete).

## Stored JSON

`state_json` example keys:

- `grid`: number[81]
- `notes`: number[][]
- `elapsedSec`: number
- `mode`: `pen` | `pencil`
- `selectedIndex`: number | null
