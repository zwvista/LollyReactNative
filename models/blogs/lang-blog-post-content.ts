export class MLangBlogPostContent {
  ID: number = 0;
  TITLE: string = "";
  CONTENT: string = "";
}

export interface MLangBlogsContent {
  records: MLangBlogPostContent[];
}
