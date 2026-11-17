import Image from 'next/image';
import { cn } from '@/lib/utils';

/**
 * Horizontal lockup (mark left, wordmark right) composed from public/brand/logo.png, which is
 * stacked and heavily padded. The original file is unchanged.
 * TODO(owner): supply the vector logo and a white version.
 */
export function Logo({ height = 32, priority = false, className }: { height?: number; priority?: boolean; className?: string }) {
  // Source: 472 x 132 px.
  const width = Math.round((472 / 132) * height);
  return (
    <Image
      src="/brand/logo-lockup.png"
      alt="Syncytium Health"
      width={width}
      height={height}
      // Next 16: `priority` is deprecated; above-the-fold logos preload and load eagerly instead.
      preload={priority}
      loading={priority ? 'eager' : undefined}
      className={cn('h-auto', className)}
      style={{ height, width }}
    />
  );
}
