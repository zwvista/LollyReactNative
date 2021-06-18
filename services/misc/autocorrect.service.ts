import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MAutoCorrect, MAutoCorrects } from '../../models/misc/autocorrect';

export class AutoCorrectService extends BaseService {
  private static _instance: AutoCorrectService;
  static get Instance() {
      return this._instance || (this._instance = new this());
  }

  getDataByLang(langid: number): Observable<MAutoCorrect[]> {
    const url = `${this.baseUrlAPI}AUTOCORRECT?filter=LANGID,eq,${langid}`;
    return this.httpGet<MAutoCorrects>(url).pipe(
      map(result => result.records.map(value => Object.assign(new MAutoCorrect(), value))),
    );
  }
}
