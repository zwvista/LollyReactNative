import { SettingsService } from '../misc/settings.service';
import { AppService } from '../misc/app.service';
import { MOnlineTextbook } from '../../models/misc/online-textbook';
import { OnlineTextbookService } from '../../services/misc/online-textbook.service';
import { singleton } from 'tsyringe';

@singleton()
export class OnlineTextbooksService {

  onlineTextbooks: MOnlineTextbook[] = [];
  onlineTextbookCount = 0;

  constructor(private onlineTextbookService: OnlineTextbookService,
              private settingsService: SettingsService,
              private appService: AppService) {
  }

  async getData(onlineTextbookFilter: number) {
    await this.appService.getData();
    const res = await this.onlineTextbookService.getDataByLang(this.settingsService.selectedLang.ID);
    this.onlineTextbooks = res;
    this.onlineTextbookCount = res.length;
  }
}
