import { useEffect, useRef } from "react";
import Player from "video.js/dist/types/player";

export function useVideoWatchTracker(
  player: Player | null,
  onThresholdReached: (milestone: number) => void,
  thresholdSeconds: number = 10
): void {
  const watchTimeRef = useRef<number>(0);
  const lastTimeRef = useRef<number | null>(null);
  const thresholdsPassedRef = useRef<number>(0);

  useEffect(() => {
    if (!player) return;

    const onTimeUpdate = () => {
      const currentTime = player.currentTime(); // in seconds
      const lastTime = lastTimeRef.current;

      if (lastTime !== null && !player.paused()) {
        const delta = currentTime - lastTime;
        if (delta > 0) {
          watchTimeRef.current += delta;

          const thresholdsPassed = Math.floor(watchTimeRef.current / thresholdSeconds);
          const newMilestones = thresholdsPassed - thresholdsPassedRef.current;

          if (newMilestones > 0) {
            for (let i = 1; i <= newMilestones; i++) {
              const milestone = (thresholdsPassedRef.current + i) * thresholdSeconds;
              onThresholdReached(milestone);
            }
            thresholdsPassedRef.current = thresholdsPassed;
          }
        }
      }

      lastTimeRef.current = currentTime;
    };

    player.on('timeupdate', onTimeUpdate);

    return () => {
      player.off('timeupdate', onTimeUpdate);
    };
  }, [player, onThresholdReached, thresholdSeconds]);
}

