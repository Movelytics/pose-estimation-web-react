# Changelog

## [0.3.5] — 2026-10-01

### Changed

- Depends on `@pose-tracker/pose-estimation-web@0.3.5`.

## [0.3.4] — 2026-09-29

### Changed

- Depends on `@pose-tracker/pose-estimation-web@0.3.4`.

## [0.3.3] — 2026-09-29

### Changed

- Depends on `@pose-tracker/pose-estimation-web@0.3.3` (same analysis, grade E, and back-flexibility contract).

## [0.3.1] — 2026-09-08

### Changed

- Depends on `@pose-tracker/pose-estimation-web@0.3.1`.
- Provider `engine` default is V4 (catalog squat still needs explicit `engine: 'v4'`).

## [0.3.0] — 2026-08-26

### Added

- `engine?: 'v3' | 'v4'` on `PoseTrackerProvider` (default `'v3'`).
- Re-exports `EngineChannel`, `V4_ONLY_EXERCISE_IDS`, `normalizeEngineChannel`, `requiresEngineV4`.
- Depends on `@pose-tracker/pose-estimation-web@0.3.0`.

## [0.2.0] — 2026-08

Thin React wrapper over `@pose-tracker/pose-estimation-web`.
