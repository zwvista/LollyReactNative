import { inject } from 'typedin';
import { ReplaySubject } from 'rxjs';
import { SettingsService } from './settings.service';

export class AppService {

  private _initializeObject: ReplaySubject<void> = new ReplaySubject<void>();
  get initializeObject() {
    return this._initializeObject.asObservable();
  }

  isInitialized = false;

  constructor(@inject private settingsService: SettingsService) {
    settingsService.getData().subscribe(_ => {
      this.isInitialized = true;
      this._initializeObject.next(undefined);
    });
  }

}
