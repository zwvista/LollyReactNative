import { singleton } from "tsyringe";
import { BaseService } from "../misc/base.service";
import { MLangBlogPost, MLangBlogPosts } from "../../models/blogs/lang-blog-post.ts";

@singleton()
export class LangBlogPostService extends BaseService {

  async getDataByLang(langid: number): Promise<MLangBlogPost[]> {
    const url = `${this.baseUrlAPI}LANGBLOGPOSTS?filter=LANGID,eq,${langid}&order=TITLE`;
    const result = await this.httpGet<MLangBlogPosts>(url);
    return result.records;
  }

  private async create(item: MLangBlogPost): Promise<number> {
    const url = `${this.baseUrlAPI}LANGBLOGPOSTS`;
    const payload = { ...item, ID: null };
    return await this.httpPost<number>(url, payload);
  }

  private async update(item: MLangBlogPost): Promise<number> {
    const url = `${this.baseUrlAPI}LANGBLOGPOSTS/${item.ID}`;
    return await this.httpPut<number>(url, item);
  }

  async updatePost(item: MLangBlogPost): Promise<number> {
    if (!item.ID)
      return await this.create(item);
    else
      return await this.update(item);
  }

  async delete(id: number): Promise<number> {
    const url = `${this.baseUrlAPI}LANGBLOGPOSTS/${id}`;
    return await this.httpDelete(url);
  }
}
