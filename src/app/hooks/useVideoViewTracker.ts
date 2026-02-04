import { useEffect, useRef } from 'react';
import Player from "video.js/dist/types/player";

export function useVideoViewTracker(
  player: Player | null,
  onTimeWatched: () => void
): void {
  const watchTimeRef = useRef<number>(0);
  const lastTimeRef = useRef<number | null>(null);
  const hasTriggeredRef = useRef<boolean>(false);

  const TEN_MINUTES = 60; // in seconds

  useEffect(() => {
    if (!player) return;

    const onTimeUpdate = () => {
      const currentTime = player.currentTime(); // in seconds
      const lastTime = lastTimeRef.current;

      if (lastTime !== null && !player.paused()) {
        const delta = currentTime - lastTime;
        if (delta > 0) {
          watchTimeRef.current += delta;

          if (!hasTriggeredRef.current && watchTimeRef.current >= TEN_MINUTES) {
            hasTriggeredRef.current = true;
            onTimeWatched(); // ⬅️ Trigger view count update
          }
        }
      }

      lastTimeRef.current = currentTime;
    };

    player.on('timeupdate', onTimeUpdate);

    return () => {
      player.off('timeupdate', onTimeUpdate);
    };
  }, [player, onTimeWatched]);
}