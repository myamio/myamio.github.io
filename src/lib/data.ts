import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export interface SiteData {
  profile: {
    name: string;
    title: string;
    intro: string;
    avatar: string;
  };
  links: {
    title: string;
    url: string | null;
    description: string;
    icon: string;
    rssUrl?: string;
  }[];
  outputs: {
    title: string;
    url: string | null;
    description: string;
    icon: string;
  }[];
  seo: {
    title: string;
    description: string;
    language: string;
  };
  gist?: {
    gistId: string;
    username: string;
  };
}

let cachedSiteData: SiteData | null = null;

export function getSiteData(): SiteData {
  if (cachedSiteData) {
    return cachedSiteData;
  }
  const filePath = path.join(process.cwd(), 'src/data/site.yml');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  cachedSiteData = yaml.load(fileContents) as SiteData;
  return cachedSiteData;
}
