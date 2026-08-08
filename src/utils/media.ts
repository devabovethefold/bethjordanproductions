/**
 * Media optimization utility for Beth Jordan Productions.
 * Routes images through media-processor CDN (images.tryabovethefold.org)
 * and falls back cleanly to local/R2 assets.
 */

export function getOptimizedImageUrl(
  src: string | undefined | null,
  fallback = '/_emdash/api/media/file/ivr_headset_stock.png?v=3'
): string {
  if (!src || src.trim() === '') {
    return fallback;
  }

  const trimmed = src.trim();

  // If already served from media-processor CDN
  if (trimmed.includes('images.tryabovethefold.org')) {
    return trimmed;
  }

  // If it's a Pexels image or external URL, return as-is (Pexels handles compression via auto=compress query)
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // Local/EmDash route
  return trimmed;
}
