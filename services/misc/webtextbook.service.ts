import { BaseService } from './base.service';
import { MAutoCorrect, MAutoCorrects } from '../../models/misc/autocorrect';
import { singleton } from 'tsyringe';
import { MWebTextbook, MWebTextbooks } from "../../models/misc/webtextbook.ts";

@singleton()
export class WebTextbookService extends BaseService {

  async getDataByLang(langid: number): Promise<MWebTextbook[]> {
    const url = `${this.baseUrlAPI}VWEBTEXTBOOKS?filter=LANGID,eq,${langid}`;
    const result = await this.httpGet<MWebTextbooks>(url);
    return result.records.map(value => Object.assign(new MWebTextbook(), value));
  }
}
