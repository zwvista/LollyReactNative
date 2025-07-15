export class MLangBlogGroup {
  ID: number = 0;
  LANGID: number = 0;
  GROUPNAME: string = "";
  GPID?: number;
}

export interface MLangBlogGroups {
  records: MLangBlogGroup[];
}
