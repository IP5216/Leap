import { useAppStore } from '@/store/useAppStore';
import { VERTICAL_MAX_HEIGHT } from '@/constants';

export function useVertical() {
  const height = useAppStore((s) => s.user?.verticalHeight ?? 0);
  const pct = Math.min(height / VERTICAL_MAX_HEIGHT, 1);

  const label =
    height < 24
      ? 'Just starting'
      : height < 48
      ? 'Finding your footing'
      : height < 72
      ? 'Building momentum'
      : height < 96
      ? 'Getting up there'
      : 'On top of the world';

  return { height, pct, label };
}
