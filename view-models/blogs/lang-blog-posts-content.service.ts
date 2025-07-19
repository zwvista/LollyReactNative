import { singleton } from "tsyringe";
import { MLangBlogPost } from "../../models/blogs/lang-blog-post.ts";
import { LangBlogGroupsService } from "./lang-blog-groups.service.ts";

@singleton()
export class LangBlogPostsContentService {
  constructor(public langBlogGroupsService: LangBlogGroupsService,
              public posts: MLangBlogPost[],
              public selectedPostIndex: number) {}

  get selectedPost(): MLangBlogPost {
    return this.posts[this.selectedPostIndex];
  }

  next(delta: number) {
    this.selectedPostIndex = (this.selectedPostIndex + delta + this.posts.length) % this.posts.length;
  }
}
