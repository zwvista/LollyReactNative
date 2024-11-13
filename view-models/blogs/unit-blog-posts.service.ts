import { singleton } from "tsyringe";
import { SettingsService } from "../misc/settings.service.ts";
import { AppService } from "../misc/app.service.ts";
import { BlogService } from "../../services/blogs/blog.service.ts";

@singleton()
export class UnitBlogPostsService {
  private blogService = new BlogService();

  constructor(private settingsService: SettingsService,
              private appService: AppService) {
  }

  async getHtml(unit: number): Promise<string> {
    await this.appService.getData();
    const content = await this.settingsService.getBlogContent(unit);
    return this.blogService.markedToHtml(content);
  }
}
