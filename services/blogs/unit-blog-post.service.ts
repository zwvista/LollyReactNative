import { singleton } from "tsyringe";
import { BaseService } from "../misc/base.service.ts";
import { MUnitBlogPost, MUnitBlogPosts } from "../../models/blogs/unit-blog-post.ts";

@singleton()
export class UnitBlogPostService extends BaseService {

  async getDataByTextbook(textbookid: number, unit: number): Promise<MUnitBlogPost | undefined> {
    const url = `${this.baseUrlAPI}UNITBLOGPOSTS?filter=TEXTBOOKID,eq,${textbookid}&filter=UNIT,eq,${unit}`;
    const result = await this.httpGet<MUnitBlogPosts>(url);
    return result.records.map(value => Object.assign(new MUnitBlogPost(), value))[0];
  }

  private async create(item: MUnitBlogPost): Promise<number | any[]> {
    const url = `${this.baseUrlAPI}UNITBLOGPOSTS`;
    (item as any).ID = null;
    return await this.httpPost<number | any[]>(url, item);
  }

  private async update(item: MUnitBlogPost): Promise<number> {
    const url = `${this.baseUrlAPI}UNITBLOGPOSTS/${item.ID}`;
    return await this.httpPut<number>(url, item);
  }

  async updatePost(textbookid: number, unit: number, content: string) {
    const o = await this.getDataByTextbook(textbookid, unit);
    const item = o ?? new MUnitBlogPost();
    if (item.ID === 0) {
      item.TEXTBOOKID = textbookid;
      item.UNIT = unit;
    }
    item.CONTENT = content;
    if (item.ID === 0)
      await this.create(item);
    else
      await this.update(item);
  }
}
