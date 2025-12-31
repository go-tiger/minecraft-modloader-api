export type VersionType = 'release' | 'snapshot';

export interface MinecraftVersion {
  id: string;
  type: VersionType;
  releaseTime: string;
}

export interface LoaderVersion {
  version: string;
  stable: boolean;
}

export enum ModLoader {
  FORGE = 'forge',
  FABRIC = 'fabric',
  NEOFORGE = 'neoforge',
}

export interface MojangVersionManifest {
  latest: {
    release: string;
    snapshot: string;
  };
  versions: Array<{
    id: string;
    type: string;
    url: string;
    time: string;
    releaseTime: string;
  }>;
}

export interface FabricLoaderResponse {
  loader: {
    separator: string;
    build: number;
    maven: string;
    version: string;
    stable: boolean;
  };
}
