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

## External frames (your camera, our data)

Full guide: https://docs.posetracker.com/external-frames

Optional. Skip `<PoseCamera />` and push your own frames. The SDK draws
nothing and returns the same data as the camera flow (keypoints,
posture/placement, counter, form score). See the
[`pose-estimation-web` README](../pose-estimation-web/README.md#external-frames-your-camera-our-data)
for the rules: one frame in flight, small frames, no mixing with the camera.

```tsx
const { warmupExternal, startExercise, processFrame } = usePoseTracker({
  onCounter: (e) => setReps(e.count),
});

await warmupExternal();
startExercise('squat');
const { dropped, pose, events } = await processFrame({
  image: bitmap,
  width: bitmap.width,
  height: bitmap.height,
  timestampMs: performance.now(),
});
```
