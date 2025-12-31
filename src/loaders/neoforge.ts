import { fetchText } from '../utils/fetcher.js';
import { parseMavenMetadata } from '../utils/xml-parser.js';
import type { LoaderVersion } from '../types.js';

const NEOFORGE_MAVEN_URL = 'https://maven.neoforged.net/releases/net/neoforged/neoforge/maven-metadata.xml';

function mcVersionFromNeoForgeVersion(neoforgeVersion: string): string {
  const parts = neoforgeVersion.split('.');
  if (parts.length < 2) return '';

  const major = parseInt(parts[0], 10);
  const minor = parseInt(parts[1], 10);

  if (major >= 20) {
    return `1.${major}.${minor}`;
  }

  return '';
}

export async function getNeoForgeVersions(mcVersion: string): Promise<LoaderVersion[]> {
  const xml = await fetchText(NEOFORGE_MAVEN_URL);
  const metadata = parseMavenMetadata(xml);

  const versions = metadata.metadata.versioning.versions.version;

  const filtered = versions
    .filter((v) => {
      const inferredMc = mcVersionFromNeoForgeVersion(v);
      return inferredMc === mcVersion;
    })
    .map((v) => ({
      version: v,
      stable: !v.includes('beta') && !v.includes('alpha'),
    }))
    .reverse();

  return filtered;
}

export async function getSupportedMinecraftVersionsForNeoForge(): Promise<string[]> {
  const xml = await fetchText(NEOFORGE_MAVEN_URL);
  const metadata = parseMavenMetadata(xml);

  const versions = metadata.metadata.versioning.versions.version;

  const mcVersions = new Set<string>();
  for (const v of versions) {
    const mcVer = mcVersionFromNeoForgeVersion(v);
    if (mcVer) {
      mcVersions.add(mcVer);
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
