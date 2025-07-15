export class MLangBlogPost {
  ID: number = 0;
  LANGID: number = 0;
  TITLE: string = "";
  URL: string = "";
  GPID?: number;
}

export interface MLangBlogPosts {
  records: MLangBlogPost[];
}
