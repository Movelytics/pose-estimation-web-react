import type {
  PoseTrackerCallbacks,
  PoseTrackerEvent,
} from '@pose-tracker/pose-estimation-web';
import { useEffect, useRef } from 'react';
import { usePoseTrackerContext, type PoseTrackerContextValue } from './PoseTrackerProvider';

/**
 * Access the PoseTracker pipeline and subscribe to typed events (RN light parity).
 */
export function usePoseTracker(callbacks: PoseTrackerCallbacks = {}): PoseTrackerContextValue {
  const context = usePoseTrackerContext();
  const callbacksRef = useRef(callbacks);
  callbacksRef.current = callbacks;

  useEffect(() => {
    const offEvents = context.addEventListener((event: PoseTrackerEvent) => {
      const cb = callbacksRef.current;
      switch (event.type) {
        case 'initialization':
          cb.onInitialization?.(event);
          break;
        case 'error':
          cb.onError?.(event);
          break;
        case 'warning':
          cb.onWarning?.(event);
          break;
        case 'keypoints':
          cb.onKeypoints?.(event);
          break;
        case 'stats':
          cb.onStats?.(event);
          break;
        case 'angles':
          cb.onAngles?.(event);
          break;
        case 'counter':
          cb.onCounter?.(event);
          break;
        case 'posture':
          cb.onPosture?.(event);
          break;
        case 'progression':
          cb.onProgression?.(event);
          break;
        case 'recommendations':
          cb.onRecommendations?.(event);
          break;
        case 'form_score':
          cb.onFormScore?.(event);
          break;
        case 'exercise_summary':
          cb.onExerciseSummary?.(event);
          break;
        case 'jump_calibration':
          cb.onJumpCalibration?.(event);
          break;
        case 'jump_started':
          cb.onJumpStarted?.(event);
          break;
        case 'jump_height':
          cb.onJumpHeight?.(event);
          break;
        case 'jump_discarded':
          cb.onJumpDiscarded?.(event);
          break;
        case 'jump_result':
          cb.onJumpResult?.(event);
          break;
        case 'jump_summary':
          cb.onJumpSummary?.(event);
          break;
        case 'quality_changed':
          cb.onQualityChanged?.(event);
          break;
        case 'performance_warning':
          cb.onPerformanceWarning?.(event);
          break;
        case 'runtime_download_progress':
          cb.onRuntimeDownloadProgress?.(event);
          break;
      }
    });
    const offMessages = context.addMessageListener((message) => {
      callbacksRef.current.onMessage?.(message);
    });
    return () => {
      offEvents();
      offMessages();
    };
  }, [context]);

  return context;
}
