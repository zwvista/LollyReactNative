import { singleton } from "tsyringe";
import { LangBlogService } from "./lang-blog.service.ts";

@singleton()
export class LangBlogGroupsService extends LangBlogService {
  async getGroups() {
    await this.appService.getData();
    this.langBlogGroups = await this.langBlogGroupService.getDataByLang(this.settingsService.selectedLang.ID);
  }

  async getPosts() {
    this.langBlogPosts = await this.langBlogPostService.getDataByLangGroup(
      this.settingsService.selectedLang.ID, this.selectedLangBlogGroup.ID);
  }
}
