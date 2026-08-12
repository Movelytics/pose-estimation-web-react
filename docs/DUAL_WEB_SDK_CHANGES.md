# Dual web SDK changes — vanilla core + React wrapper (for agents)

Internal policy for editing PoseTracker **web** packages.

## Packages

| | Vanilla core | React (web) |
|--|--------------|-------------|
| Path | `packages/pose-estimation-web/` | `packages/pose-estimation-web-react/` |
| npm | `@pose-tracker/pose-estimation-web` | `@pose-tracker/pose-estimation-web-react` |
| Role | Camera, TF.js, adapters, overlay, events, configure, engine | Thin Provider / PoseCamera / hooks |

Cross-links:

- Root README → [`../README.md`](../README.md)
- RN light (parity source) → `posetracker-rn-sdk/packages/pose-estimation-react-native-light/`
- Cursor rule → `PoseTracker/.cursor/rules/dual-web-pose-sdks.mdc`

## Default assumption

When you edit **one** web package:

1. Check whether the change is **shared UX / API / bug fix** (events, watermark,
   boot “AI Loading”, model resolver, commercial gating, public method names).
2. If **yes** → implement in **core**, then update the React wrapper surface if
   it exposes that API (Provider props, `PoseCamera` props, `usePoseTracker`
   callbacks) in the **same task**.
3. If **unclear** → **ask** before implementing: core only, React only, or both.
4. Do not silently land a shared fix only on the React package.

## Almost always both (or core + React re-export)

- Event shapes / callback names (`onKeypoints`, `onCounter`, `onInitialization`, …)
- `model` / `modelUrl` / `resolvePoseModel` behavior (default MoveNet URL)
- Watermark / free-tier / features gating
- Boot loading copy and brand chrome
- `configure` / `preload` / `startExercise` contract
- Public README examples that show the shared product API

## Usually core-only

- MoveNet / BlazePose adapters, TF.js backend init
- `getUserMedia`, DOM shell CSS, skeleton drawing, engine loader
- IIFE / CDN global build
- Packed size of `@pose-tracker/pose-estimation-web`

## Usually React-only

- `PoseTrackerProvider` / context wiring
- `PoseCamera` React lifecycle (StrictMode, refs)
- `usePoseTracker` hook ergonomics

## Do not confuse with RN packages

- Do **not** edit RN offline/light WebView HTML to “fix” web bugs
- Do **not** drag RN-only Vision / WebView injection into web packages
- Web always stays “light” (no bundled weights) unless the user explicitly asks
  for an offline web bundle

## Checklist

- [ ] Shared behavior lives in core; React stays thin
- [ ] Both packages build (`npm run build` at repo root)
- [ ] Examples still make sense (vanilla + React)
- [ ] Ask before publishing to npm
