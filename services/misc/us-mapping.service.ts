import { BaseService } from './base.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MUSMapping, MUSMappings } from '../../models/misc/usmapping';

export class UsMappingService extends BaseService {
  private static _instance: UsMappingService;
  static get Instance() {
      return this._instance || (this._instance = new this());
  }

  getData(): Observable<MUSMapping[]> {
    const url = `${this.baseUrlAPI}USMAPPINGS`;
    return this.httpGet<MUSMappings>(url).pipe(
      map(result => result.records.map(value => Object.assign(new MUSMapping(), value))),
    );
  }
}
