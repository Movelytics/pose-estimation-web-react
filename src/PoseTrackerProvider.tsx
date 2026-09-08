/**
 * React layer mirroring RN light: Provider owns PoseTrackerClient;
 * PoseCamera mounts DOM; usePoseTracker wires typed callbacks.
 */

import {
  createPoseTracker,
  type PoseTrackerClient,
  type PoseTrackerClientOptions,
  type StartExerciseOptions,
  type PoseTrackerMode,
  type PoseTrackerStatus,
  type ErrorEvent,
  type PoseTrackerEventListener,
  type SdkManifest,
  type ExerciseConfig,
  type ClassicNativeMessage,
  type PreloadOptions,
} from '@pose-tracker/pose-estimation-web';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

export interface PoseTrackerContextValue {
  client: PoseTrackerClient;
  status: PoseTrackerStatus;
  mode: PoseTrackerMode;
  error: ErrorEvent | null;
  manifest: SdkManifest | null;
  exercises: ExerciseConfig[];
  preload: (options?: PreloadOptions) => Promise<void>;
  warmup: (options?: PreloadOptions) => Promise<void>;
  configure: (apiToken?: string) => Promise<boolean>;
  startExercise: (exerciseId: string, options?: StartExerciseOptions) => void;
  stopExercise: () => void;
  setModel: (
    model?: PoseTrackerClientOptions['model'],
    modelUrl?: string,
  ) => Promise<void>;
  setSource: PoseTrackerClient['setSource'];
  analyze: PoseTrackerClient['analyze'];
  getSource: PoseTrackerClient['getSource'];
  getAvailableExercises: () => ExerciseConfig[];
  getAvailableCustomExercises: () => ReturnType<PoseTrackerClient['getAvailableCustomExercises']>;
  addEventListener: (listener: PoseTrackerEventListener) => () => void;
  addMessageListener: (listener: (message: ClassicNativeMessage) => void) => () => void;
  /** Internal: used by PoseCamera to attach the DOM shell. */
  _registerMountHost: (el: HTMLElement | null) => void;
  options: PoseTrackerClientOptions;
  autoStart: boolean;
  autoPreload: boolean;
}

const PoseTrackerContext = createContext<PoseTrackerContextValue | null>(null);

export interface PoseTrackerProviderProps {
  apiToken?: string;
  /**
   * Remote engine. Default `'v4'`. Pass `'v3'` for the production FSM bundle.
   * Unlabeled `startExercise('squat')` still uses the V3 squat FSM unless this
   * is explicitly `'v4'`.
   */
  engine?: 'v3' | 'v4';
  options?: PoseTrackerClientOptions;
  /**
   * When true, PoseCamera calls `start()` after mount (full cold start).
   * Default true for web camera screens.
   */
  autoStart?: boolean;
  /** Warm model on provider mount without camera (coldStart basic). Default false. */
  autoPreload?: boolean;
  children: React.ReactNode;
}

export function PoseTrackerProvider({
  apiToken,
  engine,
  options,
  autoStart = true,
  autoPreload = false,
  children,
}: PoseTrackerProviderProps): React.JSX.Element {
  const merged = useMemo<PoseTrackerClientOptions>(
    () => ({
      ...options,
      apiToken: apiToken ?? options?.apiToken,
      engine: engine ?? options?.engine,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      apiToken,
      engine,
      options?.engine,
      options?.model,
      options?.modelUrl,
      options?.facingMode,
      options?.position,
      options?.drawSkeleton,
      options?.drawPlacementBox,
      options?.loadingText,
      options?.showWatermark,
      options?.debugHud,
      options?.baseUrl,
      options?.features,
      options?.skeletonUuid,
    ],
  );

  const clientRef = useRef<PoseTrackerClient | null>(null);
  if (!clientRef.current) {
    clientRef.current = createPoseTracker(merged);
  }
  const client = clientRef.current;

  const [status, setStatus] = useState<PoseTrackerStatus>(client.getStatus());
  const [mode, setMode] = useState<PoseTrackerMode>(client.getMode());
  const [error, setError] = useState<ErrorEvent | null>(null);
  const [manifest, setManifest] = useState<SdkManifest | null>(client.getManifest());
  const [exercises, setExercises] = useState<ExerciseConfig[]>(client.getAvailableExercises());
  const hostRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const offState = client.onStateChange(() => {
      setStatus(client.getStatus());
      setMode(client.getMode());
      setError(client.getError());
      setManifest(client.getManifest());
      setExercises(client.getAvailableExercises());
    });
    if (autoPreload) {
      client.preload({ coldStart: 'basic' }).catch(() => {});
    }
    return () => {
      offState();
    };
  }, [client, autoPreload]);

  useEffect(() => {
    return () => {
      void client.dispose();
      clientRef.current = null;
    };
  }, [client]);

  const preload = useCallback((opts?: PreloadOptions) => client.preload(opts), [client]);
  const configure = useCallback((token?: string) => client.configure(token), [client]);
  const startExercise = useCallback(
    (id: string, exerciseOptions?: StartExerciseOptions) =>
      client.startExercise(id, exerciseOptions),
    [client],
  );
  const stopExercise = useCallback(() => client.stopExercise(), [client]);
  const setModel = useCallback(
    (model?: PoseTrackerClientOptions['model'], modelUrl?: string) =>
      client.setModel(model, modelUrl),
    [client],
  );
  const setSource = useCallback(
    (...args: Parameters<PoseTrackerClient['setSource']>) => client.setSource(...args),
    [client],
  );
  const analyze = useCallback(() => client.analyze(), [client]);
  const getSource = useCallback(() => client.getSource(), [client]);
  const getAvailableExercises = useCallback(() => client.getAvailableExercises(), [client]);
  const getAvailableCustomExercises = useCallback(
    () => client.getAvailableCustomExercises(),
    [client],
  );
  const addEventListener = useCallback(
    (listener: PoseTrackerEventListener) => client.addEventListener(listener),
    [client],
  );
  const addMessageListener = useCallback(
    (listener: (message: ClassicNativeMessage) => void) => client.addMessageListener(listener),
    [client],
  );

  const _registerMountHost = useCallback((el: HTMLElement | null) => {
    hostRef.current = el;
  }, []);

  const value = useMemo<PoseTrackerContextValue>(
    () => ({
      client,
      status,
      mode,
      error,
      manifest,
      exercises,
      preload,
      warmup: preload,
      configure,
      startExercise,
      stopExercise,
      setModel,
      setSource,
      analyze,
      getSource,
      getAvailableExercises,
      getAvailableCustomExercises,
      addEventListener,
      addMessageListener,
      _registerMountHost,
      options: merged,
      autoStart,
      autoPreload,
    }),
    [
      client,
      status,
      mode,
      error,
      manifest,
      exercises,
      preload,
      configure,
      startExercise,
      stopExercise,
      setModel,
      setSource,
      analyze,
      getSource,
      getAvailableExercises,
      getAvailableCustomExercises,
      addEventListener,
      addMessageListener,
      _registerMountHost,
      merged,
      autoStart,
      autoPreload,
    ],
  );

  return (
    <PoseTrackerContext.Provider value={value}>{children}</PoseTrackerContext.Provider>
  );
}

export function usePoseTrackerContext(): PoseTrackerContextValue {
  const ctx = useContext(PoseTrackerContext);
  if (!ctx) {
    throw new Error('usePoseTracker must be used within PoseTrackerProvider');
  }
  return ctx;
}
