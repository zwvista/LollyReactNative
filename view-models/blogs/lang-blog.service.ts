import { singleton } from "tsyringe";
import { MLangBlogGroup, MLangBlogGroups } from "../../models/blogs/lang-blog-group.ts";
import { MLangBlogPost } from "../../models/blogs/lang-blog-post.ts";
import { SettingsService } from "../misc/settings.service.ts";
import { AppService } from "../misc/app.service.ts";
import { LangBlogGroupService } from "../../services/blogs/lang-blog-group.service.ts";
import { LangBlogPostService } from "../../services/blogs/lang-blog-post.service.ts";
import { LangBlogPostContentService } from "../../services/blogs/lang-blog-post-content.service.ts";
import { MLanguage } from "../../models/misc/language.ts";
import { BlogService } from "../../services/blogs/blog.service.ts";

@singleton()
export class LangBlogService {
  private blogService = new BlogService();
  langBlogGroups: MLangBlogGroup[] = [];
  langBlogPosts: MLangBlogPost[] = [];
  selectedLangBlogGroup!: MLangBlogGroup;
  selectedLangBlogPost!: MLangBlogPost;

  constructor(protected langBlogGroupService: LangBlogGroupService,
              protected langBlogPostService: LangBlogPostService,
              protected langBlogPostContentService: LangBlogPostContentService,
              protected settingsService: SettingsService,
              protected appService: AppService) {
  }

  async getHtml(): Promise<string> {
    await this.appService.getData();
    const item = await this.langBlogPostContentService.getDataById(this.selectedLangBlogPost.ID);
    const content = item?.CONTENT ?? "";
    return this.blogService.markedToHtml(content);
  }

}
