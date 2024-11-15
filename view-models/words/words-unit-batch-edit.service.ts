import { WordsUnitService } from "./words-unit.service.ts";
import { SettingsService } from "../misc/settings.service.ts";

export default class WordsUnitBatchEditService {
  unitChecked = false;
  partChecked = false;
  seqnumChecked = false;
  unit = 0;
  part = 0;
  seqnum = 0;
  constructor(private wordsUnitService: WordsUnitService,
              settingsService: SettingsService) {
    this.unit = settingsService.USUNITTO;
    this.part = settingsService.USPARTTO;
  }

  save() {
    if (!(this.unitChecked || this.partChecked || this.seqnumChecked)) return;
    this.wordsUnitService.unitWords.filter(item => item.isChecked).forEach(async item => {
      if (this.unitChecked) item.UNIT = this.unit;
      if (this.partChecked) item.PART = this.part;
      if (this.seqnumChecked) item.SEQNUM += this.seqnum;
      await this.wordsUnitService.update(item);
    });
  }
}
