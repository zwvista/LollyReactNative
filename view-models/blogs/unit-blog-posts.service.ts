import { singleton } from "tsyringe";
import { SettingsService } from "../misc/settings.service.ts";
import { AppService } from "../misc/app.service.ts";
import { BlogService } from "../../services/blogs/blog.service.ts";
import { MSelectItem } from "../../common/selectitem.ts";

@singleton()
export class UnitBlogPostsService {
  private blogService = new BlogService();
  get units(): MSelectItem[] {
    return this.settingsService.units;
  }
  selectedUnitIndex: number;
  get selectedUnit(): MSelectItem {
    return this.units[this.selectedUnitIndex];
  }

  constructor(private settingsService: SettingsService,
              private appService: AppService) {
    this.selectedUnitIndex = this.units.findIndex(x => x.value === this.settingsService.USUNITTO);
  }

  async getHtml(): Promise<string> {
    await this.appService.getData();
    const content = await this.settingsService.getBlogContent(this.selectedUnit.value);
    return this.blogService.markedToHtml(content);
  }

  next(delta: number) {
    this.selectedUnitIndex = (this.selectedUnitIndex + delta + this.units.length) % this.units.length;
  }
}
