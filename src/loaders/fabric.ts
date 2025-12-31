import { fetchJson } from '../utils/fetcher.js';
import type { FabricLoaderResponse, LoaderVersion } from '../types.js';

const FABRIC_META_URL = 'https://meta.fabricmc.net/v2/versions/loader';

export async function getFabricVersions(mcVersion: string): Promise<LoaderVersion[]> {
  const url = `${FABRIC_META_URL}/${mcVersion}`;

  try {
    const response = await fetchJson<FabricLoaderResponse[]>(url);

    return response.map((item) => ({
      version: item.loader.version,
      stable: item.loader.stable,
    }));
  } catch (error) {
    if (error instanceof Error && error.message.includes('404')) {
      return [];
    }
    throw error;
  }
}

export async function getAllFabricVersions(): Promise<LoaderVersion[]> {
  const url = 'https://meta.fabricmc.net/v2/versions/loader';

  const response = await fetchJson<Array<{ version: string; stable: boolean }>>(url);

  return response.map((item) => ({
    version: item.version,
    stable: item.stable,
  }));
}
