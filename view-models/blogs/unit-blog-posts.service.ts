import { container, singleton } from "tsyringe";
import { SettingsService } from "../misc/settings.service.ts";
import { AppService } from "../misc/app.service.ts";
import { BlogService } from "../../services/blogs/blog.service.ts";
import { MSelectItem } from "../../common/selectitem.ts";

@singleton()
export class UnitBlogPostsService {
  private blogService = new BlogService();
  units: MSelectItem[];
  unit: MSelectItem;

  constructor(private settingsService: SettingsService,
              private appService: AppService) {
    this.units = this.settingsService.units;
    this.unit = this.units.find(x => x.value === this.settingsService.USUNITTO)!;
  }

  async getHtml(unit: number): Promise<string> {
    await this.appService.getData();
    const content = await this.settingsService.getBlogContent(unit);
    return this.blogService.markedToHtml(content);
  }
}
