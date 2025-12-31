import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser({
  ignoreAttributes: true,
  isArray: (name) => name === 'version',
});

export interface MavenMetadata {
  metadata: {
    groupId: string;
    artifactId: string;
    versioning: {
      latest: string;
      release: string;
      versions: {
        version: string[];
      };
      lastUpdated: string;
    };
  };
}

export function parseMavenMetadata(xml: string): MavenMetadata {
  return parser.parse(xml) as MavenMetadata;
}
