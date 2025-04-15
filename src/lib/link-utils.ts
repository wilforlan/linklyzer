import { nanoid } from 'nanoid';

// Generate a short ID for links (8 characters by default)
export function generateShortId(length: number = 8): string {
  return nanoid(length);
}

// Validate a URL (basic validation)
export function isValidUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return ['http:', 'https:'].includes(parsedUrl.protocol);
  } catch (e) {
    return false;
  }
}

// Format a URL to ensure it has the proper protocol
export function formatUrl(url: string): string {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
}

// Parse user agent to get device info
export function parseUserAgent(userAgent: string | null): string | null {
  if (!userAgent) return null;
  
  // Simple detection - can be enhanced with a proper user-agent parsing library
  if (userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'iOS';
  if (userAgent.includes('Android')) return 'Android';
  if (userAgent.includes('Windows')) return 'Windows';
  if (userAgent.includes('Mac OS')) return 'macOS';
  if (userAgent.includes('Linux')) return 'Linux';
  
  return 'Unknown';
} 