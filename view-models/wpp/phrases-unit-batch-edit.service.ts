import { SettingsService } from "../misc/settings.service.ts";
import { PhrasesUnitService } from "./phrases-unit.service.ts";

export default class PhrasesUnitBatchEditService {
  unitChecked = false;
  partChecked = false;
  seqnumChecked = false;
  unit = 0;
  part = 0;
  seqnum = 0;
  constructor(private phrasesUnitService: PhrasesUnitService,
              settingsService: SettingsService) {
    this.unit = settingsService.USUNITTO;
    this.part = settingsService.USPARTTO;
  }

  save() {
    if (!(this.unitChecked || this.partChecked || this.seqnumChecked)) return;
    this.phrasesUnitService.unitPhrases.filter(item => item.isChecked).forEach(async item => {
      if (this.unitChecked) item.UNIT = this.unit;
      if (this.partChecked) item.PART = this.part;
      if (this.seqnumChecked) item.SEQNUM += this.seqnum;
      await this.phrasesUnitService.update(item);
    });
  }
}
