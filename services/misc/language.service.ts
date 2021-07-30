import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MLanguage, MLanguages } from '../../models/misc/language';

export class LanguageService extends BaseService {
  private static _instance: LanguageService;
  static get Instance() {
    return this._instance || (this._instance = new this());
  }

  getData(): Observable<MLanguage[]> {
    const url = `${this.baseUrlAPI}LANGUAGES?filter=ID,neq,0`;
    return this.httpGet<MLanguages>(url).pipe(
      // https://stackoverflow.com/questions/5873624/parse-json-string-into-a-particular-object-prototype-in-javascript
      map(result => result.records.map(value => Object.assign(new MLanguage(), value))),
    );
  }
}
