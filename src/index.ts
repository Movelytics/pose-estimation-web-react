/**
 * @pose-tracker/pose-estimation-web-react — thin React (web) wrapper.
 *
 * Also documented as the React half of the **pose-estimation-web** product line.
 * Legacy name `@pose-tracker/pose-estimation-react` is not published — use this package.
 */

export { PoseTrackerProvider, usePoseTrackerContext } from './PoseTrackerProvider';
export type {
  PoseTrackerProviderProps,
  PoseTrackerContextValue,
} from './PoseTrackerProvider';

export { PoseCamera } from './PoseCamera';
export type { PoseCameraProps } from './PoseCamera';

export { usePoseTracker } from './usePoseTracker';

// Re-export useful core types / helpers for one-import DX
export {
  createPoseTracker,
  PoseTrackerClient,
  resolvePoseModel,
  DEFAULT_MOVENET_LIGHTNING_URL,
  DEFAULT_LOADING_TEXT,
  shouldShowWatermark,
  COCO_KEYPOINT_NAMES,
  SDK_VERSION,
  SDK_NAME,
} from '@pose-tracker/pose-estimation-web';

export type {
  PoseTracker,
  PoseTrackerOptions,
  PoseTrackerClientOptions,
  PoseTrackerCallbacks,
  StartExerciseOptions,
  KeypointsEvent,
  InitializationEvent,
  ErrorEvent,
  CounterEvent,
  PostureEvent,
  PoseModelAlias,
  Keypoint,
  Pose,
  SdkManifest,
  ExerciseConfig,
  ColdStartMode,
  PreloadOptions,
} from '@pose-tracker/pose-estimation-web';
