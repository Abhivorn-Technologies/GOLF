import dbConnect from '@/lib/mongodb';
import PageSettings from '@/models/PageSettings';

const pageSettingsCache = new Map<string, { timestamp: number; data: any }>();
const CACHE_TTL_MS = 5000; // 5 seconds

export async function getPageSettings(pageName: string) {
  const now = Date.now();
  if (pageSettingsCache.has(pageName)) {
    const cached = pageSettingsCache.get(pageName)!;
    if (now - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }
  }

  try {
    const fetchPromise = (async () => {
      await dbConnect();
      const settings = await PageSettings.findOne({ page: pageName }).lean();
      return settings ? JSON.parse(JSON.stringify(settings)) : null;
    })();

    const timeoutPromise = new Promise<null>((resolve) =>
      setTimeout(() => resolve(null), 3000)
    );

    const result = await Promise.race([fetchPromise, timeoutPromise]);
    if (result) {
      pageSettingsCache.set(pageName, { timestamp: Date.now(), data: result });
    }
    return result;
  } catch (e) {
    console.error(`Error fetching PageSettings for ${pageName}:`, e);
  }

  return null;
}

export function clearPageSettingsCache(pageName?: string) {
  if (pageName) {
    pageSettingsCache.delete(pageName);
  } else {
    pageSettingsCache.clear();
  }
}
