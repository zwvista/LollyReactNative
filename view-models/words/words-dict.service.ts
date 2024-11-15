import OnlineDict from "../../components/OnlineDict.ts";
import { container } from "tsyringe";
import { SettingsService } from "../misc/settings.service.ts";
import { ValueOnly } from "../../App.tsx";
import { MDictionary } from "../../models/misc/dictionary.ts";
import { Dispatch, SetStateAction } from "react";

export class WordsDictService {
  constructor(public words: ValueOnly[],
              public selectedWordIndex: number) {}
  private settingsService = container.resolve(SettingsService);
  private onlineDict = new OnlineDict(this.settingsService);
  get selectedWord(): string {
    return this.words[this.selectedWordIndex].value;
  }
  get dictsReference(): MDictionary[] {
    return this.settingsService.dictsReference;
  }
  get selectedDictReference(): MDictionary {
    return this.settingsService.selectedDictReference;
  }

  onWordChange(e: ValueOnly) {
    this.selectedWordIndex = this.words.indexOf(e);
  }

  async onDictChange(e: MDictionary) {
    this.settingsService.selectedDictReference = e;
    await this.settingsService.updateDictReference();
  }

  async searchDict(setWebViewSource: Dispatch<SetStateAction<any>>) {
    await this.onlineDict.searchDict(
      this.selectedWord, this.settingsService.selectedDictReference, setWebViewSource)
  }

  next(delta: number) {
    this.selectedWordIndex =
      (this.selectedWordIndex + delta + this.words.length) % this.words.length;
  }
}
