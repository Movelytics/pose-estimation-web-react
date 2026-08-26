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
  normalizePoseSource,
  DEFAULT_MOVENET_LIGHTNING_URL,
  DEFAULT_LOADING_TEXT,
  shouldShowWatermark,
  COCO_KEYPOINT_NAMES,
  SDK_VERSION,
  SDK_NAME,
  V4_ONLY_EXERCISE_IDS,
  normalizeEngineChannel,
  requiresEngineV4,
} from '@pose-tracker/pose-estimation-web';

export type {
  PoseTracker,
  PoseTrackerOptions,
  PoseTrackerClientOptions,
  PoseTrackerCallbacks,
  StartExerciseOptions,
  EngineChannel,
  KeypointsEvent,
  InitializationEvent,
  ErrorEvent,
  CounterEvent,
  PostureEvent,
  PoseModelAlias,
  Keypoint,
  Pose,
  PoseSource,
  PoseSourceType,
  SdkManifest,
  ExerciseConfig,
  ColdStartMode,
  PreloadOptions,
} from '@pose-tracker/pose-estimation-web';
