export class MLangBlogGP {
  ID: number = 0;
  GROUPID: number = 0;
  POSTID: number = 0;
  GROUPNAME: string = "";
  TITLE: string = "";
  URL: string = "";
}

export interface MLangBlogGPs {
  records: MLangBlogGP[];
}
