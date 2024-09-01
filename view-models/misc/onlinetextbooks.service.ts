import { SettingsService } from '../misc/settings.service';
import { AppService } from '../misc/app.service';
import { MOnlineTextbook } from '../../models/misc/onlinetextbook';
import { OnlineTextbookService } from '../../services/misc/onlinetextbook.service';
import { singleton } from 'tsyringe';

@singleton()
export class OnlineTextbooksService {

  onlineTextbooks: MOnlineTextbook[] = [];
  onlineTextbookCount = 0;

  constructor(private onlineTextbookService: OnlineTextbookService,
              private settingsService: SettingsService,
              private appService: AppService) {
  }

  async getData(textbookFilter: number) {
    await this.appService.getData();
    const res = await this.onlineTextbookService.getDataByLang(this.settingsService.selectedLang.ID);
    this.onlineTextbooks = res;
    this.onlineTextbookCount = res.length;
  }
}
