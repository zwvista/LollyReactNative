import { ReplaySubject } from 'rxjs';
import { SettingsService } from './settings.service';

export class AppService {
  private static _instance: AppService;
  static get Instance() {
      return this._instance || (this._instance = new this());
  }
  private settingsService = SettingsService.Instance;

  private _initializeObject: ReplaySubject<void> = new ReplaySubject<void>();
  get initializeObject() {
    return this._initializeObject.asObservable();
  }

  isInitialized = false;

  getData() {
    this.settingsService.getData().subscribe(_ => {
      this.isInitialized = true;
      this._initializeObject.next();
    });
  }

}
