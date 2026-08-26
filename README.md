# `@pose-tracker/pose-estimation-web-react`

Thin React wrapper over [`@pose-tracker/pose-estimation-web`](../pose-estimation-web/).
Mirrors RN light naming: `PoseTrackerProvider`, `PoseCamera`, `usePoseTracker`.

```bash
npm install @pose-tracker/pose-estimation-web-react @pose-tracker/pose-estimation-web @tensorflow/tfjs
```

```tsx
import {
  PoseTrackerProvider,
  PoseCamera,
  usePoseTracker,
} from '@pose-tracker/pose-estimation-web-react';

function Screen() {
  usePoseTracker({ onKeypoints: (e) => console.log(e.keypoints.length) });
  return <PoseCamera style={{ height: 480 }} />;
  // Video / image: <PoseCamera source="image" sourceFile={file} />
  // or sourceUrl — see docs/MEDIA_SOURCES.md · https://docs.posetracker.com/media-sources
}

export function App() {
  return (
    <PoseTrackerProvider options={{ model: 'movenet' }}>
      <Screen />
    </PoseTrackerProvider>
  );
}
```
