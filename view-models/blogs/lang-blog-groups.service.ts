import { singleton } from "tsyringe";
import { LangBlogService } from "./lang-blog.service.ts";

@singleton()
export class LangBlogGroupsService extends LangBlogService {
  async getGroups(filter: string) {
    await this.appService.getData();
    this.langBlogGroups = await this.langBlogGroupService.getDataByLang(this.settingsService.selectedLang.ID, filter);
  }

  async getPosts(filter: string) {
    this.langBlogPosts = await this.langBlogPostService.getDataByLangGroup(
      this.settingsService.selectedLang.ID, this.selectedLangBlogGroup.ID, filter);
  }
}
