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
  philosophy: {
    keyword: string;
  };
  links: {
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
}

export function getSiteData(): SiteData {
  const filePath = path.join(process.cwd(), 'src/data/site.yml');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return yaml.load(fileContents) as SiteData;
}
