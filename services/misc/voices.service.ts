import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { MVoice, MVoices } from '../../models/misc/voice';
import { map } from 'rxjs/operators';

export class VoicesService extends BaseService {
  private static _instance: VoicesService;
  static get Instance() {
      return this._instance || (this._instance = new this());
  }

  getDataByLang(langid: number): Observable<MVoice[]> {
    const url = `${this.baseUrlAPI}VVOICES?filter=LANGID,eq,${langid}&filter=VOICETYPEID,eq,5`;
    return this.httpGet<MVoices>(url)
      .pipe(
        map(result => result.records.map(value => Object.assign(new MVoice(), value))),
      );
  }
}
