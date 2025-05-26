export interface CoordinateResult {
  lat: number;
  lng: number;
}

export function extractCoordinatesFromUrl(url: string): CoordinateResult | null {
  try {
    const decoded = decodeURIComponent(url);
    const match = decoded.match(/maps\.google\.com\/maps\?q=([-.\d]+),([-.\d]+)/);

    if (!match) return null;

    const lat = parseFloat(match[1]);
    const lng = parseFloat(match[2]);

    if (isNaN(lat) || isNaN(lng)) return null;

    return { lat, lng };
  } catch (error) {
    console.error('Failed to extract coordinates:', error);
    return null;
  }
}

export function isValidSharedLocationLink(url: string): boolean {
  try {
    const decoded = decodeURIComponent(url);
    return decoded.includes('maps.google.com/maps?q=');
  } catch {
    return false;
  }
}
