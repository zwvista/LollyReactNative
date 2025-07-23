import { SettingsService } from './settings.service';
import { singleton } from 'tsyringe';

@singleton()
export class AppService {

  private isInitialized = false;
  private initPromise: Promise<void> | null = null;

  constructor(private settingsService: SettingsService) {
  }

  async getData(): Promise<void> {
    if (this.isInitialized) return;

    if (!this.initPromise) {
      this.initPromise = this.settingsService.getData().then(() => {
        this.isInitialized = true;
      });
    }

    return this.initPromise;
  }
}
