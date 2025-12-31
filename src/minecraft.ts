import { fetchJson } from './utils/fetcher.js';
import type { MinecraftVersion, MojangVersionManifest, VersionType } from './types.js';

const MOJANG_VERSION_MANIFEST_URL = 'https://piston-meta.mojang.com/mc/game/version_manifest.json';

export interface GetMinecraftVersionsOptions {
  type?: VersionType | 'all';
}

export async function getMinecraftVersions(
  options: GetMinecraftVersionsOptions = {}
): Promise<MinecraftVersion[]> {
  const { type = 'all' } = options;

  const manifest = await fetchJson<MojangVersionManifest>(MOJANG_VERSION_MANIFEST_URL);

  const versions = manifest.versions
    .filter((v) => v.type === 'release' || v.type === 'snapshot')
    .map((v) => ({
      id: v.id,
      type: v.type as VersionType,
      releaseTime: v.releaseTime,
    }));

  if (type === 'all') {
    return versions;
  }

  return versions.filter((v) => v.type === type);
}

export async function getLatestMinecraftVersion(
  type: VersionType = 'release'
): Promise<string> {
  const manifest = await fetchJson<MojangVersionManifest>(MOJANG_VERSION_MANIFEST_URL);
  return manifest.latest[type];
}
