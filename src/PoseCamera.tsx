import React, { useEffect, useRef } from 'react';
import { usePoseTrackerContext } from './PoseTrackerProvider';
import type {
  PoseSource,
  PoseSourceType,
  SkeletonDefinition,
} from '@pose-tracker/pose-estimation-web';

export interface PoseCameraProps {
  /** CSS style for the host container (video/canvas fill 100%). */
  style?: React.CSSProperties;
  className?: string;
  /** 'front' | 'back' — mapped to getUserMedia facingMode. Default front. */
  position?: 'front' | 'back';
  /**
   * Input mode. Default `camera`.
   * Pass a full {@link PoseSource} or `'camera' | 'video' | 'image'` with
   * `sourceUrl` / `sourceFile`.
   */
  source?: PoseSource | PoseSourceType;
  /** URL / object URL for `source: 'video' | 'image'`. */
  sourceUrl?: string;
  /** File/Blob for `source: 'video' | 'image'`. */
  sourceFile?: File | Blob;
  /** Draw navy/gold skeleton overlay. Default true. */
  drawSkeleton?: boolean;
  /** Placement guide while posture.ready === false. Default true. */
  drawPlacementBox?: boolean;
  placementPaddingPercent?: number;
  /**
   * Cold-start: `full` (default on camera screens) opens getUserMedia;
   * `basic` warms the model only (use with autoStart=false + preload).
   */
  coldStart?: 'basic' | 'full';
  /** Boot overlay copy. Default "AI Loading". */
  loadingText?: string;
  /** Force watermark; omit to derive from plan. */
  showWatermark?: boolean;
  skeletonDef?: SkeletonDefinition | null;
  skeletonUuid?: string | null;
  /** Show technical FPS HUD. Default false. */
  debugHud?: boolean;
  /**
   * Start camera + inference when mounted. Default: provider `autoStart` (true).
   */
  autoStart?: boolean;
}

/**
 * Browser camera + canvas overlay (web equivalent of RN `WebViewPoseView`).
 * Must be rendered under {@link PoseTrackerProvider}.
 */
export function PoseCamera({
  style,
  className,
  position,
  source,
  sourceUrl,
  sourceFile,
  drawSkeleton,
  drawPlacementBox,
  placementPaddingPercent,
  coldStart,
  loadingText,
  showWatermark,
  skeletonDef,
  skeletonUuid,
  debugHud,
  autoStart: autoStartProp,
}: PoseCameraProps): React.JSX.Element {
  const { client, autoStart: providerAutoStart, _registerMountHost } =
    usePoseTrackerContext();
  const hostRef = useRef<HTMLDivElement | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = hostRef.current;
    _registerMountHost(el);
    if (!el) return;

    client.updateOptions({
      ...(position ? { position } : {}),
      ...(source !== undefined ? { source } : {}),
      ...(sourceUrl !== undefined ? { sourceUrl } : {}),
      ...(sourceFile !== undefined ? { sourceFile } : {}),
      ...(typeof drawSkeleton === 'boolean' ? { drawSkeleton } : {}),
      ...(typeof drawPlacementBox === 'boolean' ? { drawPlacementBox } : {}),
      ...(typeof placementPaddingPercent === 'number'
        ? { placementPaddingPercent }
        : {}),
      ...(coldStart ? { coldStart } : {}),
      ...(loadingText ? { loadingText } : {}),
      ...(typeof showWatermark === 'boolean' ? { showWatermark } : {}),
      ...(skeletonDef !== undefined ? { skeletonDef } : {}),
      ...(skeletonUuid !== undefined ? { skeletonUuid } : {}),
      ...(typeof debugHud === 'boolean' ? { debugHud } : {}),
    });
    client.mount(el);

    const shouldStart = autoStartProp ?? providerAutoStart;
    if (shouldStart && !startedRef.current) {
      startedRef.current = true;
      const boot = async (): Promise<void> => {
        if (source !== undefined) {
          await client.setSource(source, { sourceUrl, sourceFile });
        }
        await client.start();
      };
      boot().catch(() => {
        /* errors emitted as events */
      });
    }

    return () => {
      client.stop();
      startedRef.current = false;
      _registerMountHost(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client]);

  // Live source switches without remounting the shell.
  useEffect(() => {
    if (!startedRef.current || source === undefined) return;
    void client.setSource(source, { sourceUrl, sourceFile }).catch(() => {});
  }, [client, source, sourceUrl, sourceFile]);

  return (
    <div
      ref={hostRef}
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: 480,
        background: '#000',
        ...style,
      }}
    />
  );
}
