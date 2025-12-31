import { fetchText } from '../utils/fetcher.js';
import { parseMavenMetadata } from '../utils/xml-parser.js';
import type { LoaderVersion } from '../types.js';

const FORGE_MAVEN_URL = 'https://maven.minecraftforge.net/net/minecraftforge/forge/maven-metadata.xml';

export async function getForgeVersions(mcVersion: string): Promise<LoaderVersion[]> {
  const xml = await fetchText(FORGE_MAVEN_URL);
  const metadata = parseMavenMetadata(xml);

  const versions = metadata.metadata.versioning.versions.version;
  const prefix = `${mcVersion}-`;

  const filtered = versions
    .filter((v) => v.startsWith(prefix))
    .map((v) => {
      const loaderVersion = v.slice(prefix.length);
      return {
        version: loaderVersion,
        stable: !loaderVersion.includes('beta') && !loaderVersion.includes('alpha'),
      };
    })
    .reverse();

  return filtered;
}

export async function getSupportedMinecraftVersionsForForge(): Promise<string[]> {
  const xml = await fetchText(FORGE_MAVEN_URL);
  const metadata = parseMavenMetadata(xml);

  const versions = metadata.metadata.versioning.versions.version;

  const mcVersions = new Set<string>();
  for (const v of versions) {
    const dashIndex = v.indexOf('-');
    if (dashIndex !== -1) {
      mcVersions.add(v.slice(0, dashIndex));
    }
  }

  return Array.from(mcVersions).sort((a, b) => {
    const aParts = a.split('.').map(Number);
    const bParts = b.split('.').map(Number);
    for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
      const aNum = aParts[i] || 0;
      const bNum = bParts[i] || 0;
      if (aNum !== bNum) return bNum - aNum;
    }
    return 0;
  });
}
