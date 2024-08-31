import { SettingsService } from '../misc/settings.service';
import { AppService } from '../misc/app.service';
import { MWebTextbook } from '../../models/misc/webtextbook';
import { WebTextbookService } from '../../services/misc/webtextbook.service';
import { singleton } from 'tsyringe';

@singleton()
export class WebTextbooksService {

  webTextbooks: MWebTextbook[] = [];
  webTextbookCount = 0;

  constructor(private webTextbookService: WebTextbookService,
              private settingsService: SettingsService,
              private appService: AppService) {
  }

  async getData(textbookFilter: number) {
    await this.appService.getData();
    const res = await this.webTextbookService.getDataByLang(this.settingsService.selectedLang.ID);
    this.webTextbooks = res;
    this.webTextbookCount = res.length;
  }
}
