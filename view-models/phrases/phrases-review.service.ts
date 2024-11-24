import { UnitPhraseService } from "../../services/wpp/unit-phrase.service.ts";
import { IReviewOptions, MReviewOptions } from "../../models/misc/review-options.ts";
import { interval, Subscription } from "rxjs";
import { SettingsService } from "../misc/settings.service.ts";
import { singleton } from "tsyringe";
import { MUnitPhrase } from "../../models/wpp/unit-phrase.ts";
import _ from "lodash";

@singleton()
export default class PhrasesReviewService implements IReviewOptions {

  constructor(private unitPhraseService: UnitPhraseService,
              private settingsService: SettingsService) {
  }

  lstPhrases: MUnitPhrase[] = [];
  get count() {
    return this.lstPhrases.length;
  }
  lstCorrectIDs: number[] = [];
  index = 0;
  get hasCurrent(): boolean {
    return !!this.lstPhrases.length && (this.onRepeat || this.index >= 0 && this.index < this.count);
  }
  get currentItem(): MUnitPhrase | undefined {
    return this.hasCurrent ? this.lstPhrases[this.index] : undefined;
  }
  get currentPhrase() : string {
    return this.hasCurrent ? this.lstPhrases[this.index].PHRASE : "";
  }
  options = new MReviewOptions()
  get isTestMode(): boolean {
    return this.options.mode == "Test" || this.options.mode == "Textbook";
  }
  subscription?: Subscription;
  inputFocused = false;
  onTestUpdated?: () => void;

  isSpeaking = true;
  indexString = "";
  indexVisible = true;
  correctVisible = false;
  incorrectVisible = false;
  checkNextEnabled = false;
  checkNextStringRes = "Check";
  checkPrevEnabled = false;
  checkPrevStringRes = "Check";
  checkPrevVisible = true;
  phraseTargetString = "";
  phraseTargetVisible = true;
  translationString = "";
  phraseInputString = "";
  onRepeat = true;
  moveForward = true;
  onRepeatVisible = true;
  moveForwardVisible = true;

  async newTest() {
    const f = () => {
      this.lstCorrectIDs = [];
      this.index = this.moveForward ? 0 : this.count - 1;
      this.doTest();
      this.checkNextStringRes = this.isTestMode ? "Check" : "Next";
      this.checkPrevStringRes = this.isTestMode ? "Check" : "Prev";
    };
    this.lstPhrases = [];
    this.lstCorrectIDs = [];
    this.index = 0;
    this.stopTimer();
    this.isSpeaking = this.options.speakingEnabled;
    this.moveForward = this.options.moveForward;
    this.moveForwardVisible = !this.isTestMode;
    this.onRepeat = !this.isTestMode && this.options.onRepeat;
    this.onRepeatVisible = !this.isTestMode;
    this.checkPrevVisible = !this.isTestMode;
    if (this.options.mode === "Textbook") {
      const lst = await this.unitPhraseService.getDataByTextbook(this.settingsService.selectedTextbook);
      const cnt = Math.min(this.options.reviewCount, lst.length);
      this.lstPhrases = _.shuffle(lst).slice(0, cnt);
      f();
    } else {
      this.lstPhrases = await this.unitPhraseService.getDataByTextbookUnitPart(
        this.settingsService.selectedTextbook, this.settingsService.USUNITPARTFROM,
        this.settingsService.USUNITPARTTO, '', 0);
      const nFrom = this.count * (this.options.groupSelected - 1) / this.options.groupCount;
      const nTo = this.count * this.options.groupSelected / this.options.groupCount;
      this.lstPhrases = this.lstPhrases.slice(nFrom, nTo);
      if (this.options.shuffled) this.lstPhrases = _.shuffle(this.lstPhrases);
      f();
      if (this.options.mode === "Review(Auto)")
        this.subscription = interval(this.options.interval).subscribe(_ => {
          this.check(true);
        });
    }
  }

move(toNext: Boolean) {
  const checkOnRepeat = () => {
    if (this.onRepeat) {
      this.index = (this.index + this.count) % this.count;
    }
  };
  if (this.moveForward == toNext) {
    this.index++
    checkOnRepeat();
    if (this.isTestMode && !this.hasCurrent) {
      this.index = 0;
      this.lstPhrases = this.lstPhrases.filter(o => !this.lstCorrectIDs.includes(o.ID));
    }
  } else {
    this.index--;
    checkOnRepeat();
  }
}

check(toNext: Boolean) {
  if (!this.isTestMode) {
    let b = true;
    if (this.options.mode === "Review(Manual)" && !!this.phraseInputString && this.phraseInputString !== this.currentPhrase) {
      b = false;
      this.incorrectVisible = true;
    }
    if (b) {
      this.move(toNext);
      this.doTest();
    }
  } else if (!this.correctVisible && !this.incorrectVisible) {
    this.phraseInputString = this.settingsService.autoCorrectInput(this.phraseInputString);
    this.phraseTargetVisible = true;
    if (this.phraseInputString == this.currentPhrase)
      this.correctVisible = true;
    else
      this.incorrectVisible = true;
    this.checkNextStringRes = "Next";
    this.checkPrevStringRes = "Prev";
    if (!this.hasCurrent) return;
    const o = this.currentItem!;
    const isCorrect = o.PHRASE == this.phraseInputString;
    if (isCorrect) this.lstCorrectIDs.push(o.ID);
  } else {
    this.move(toNext);
    this.doTest();
    this.checkNextStringRes = "Check";
    this.checkPrevStringRes = "Check";
  }
}

  private doTest() {
    this.indexVisible = this.hasCurrent;
    this.correctVisible = false;
    this.incorrectVisible = false;
    this.checkNextEnabled = this.hasCurrent;
    this.checkPrevEnabled = this.hasCurrent;
    this.phraseTargetString = this.currentPhrase;
    this.translationString = this.currentItem?.TRANSLATION ?? "";
    this.phraseTargetVisible = !this.isTestMode;
    this.phraseInputString = "";
    this.inputFocused = true;
    if (this.hasCurrent && this.isSpeaking)
      this.settingsService.speak(this.currentPhrase);
    if (this.hasCurrent)
      this.indexString = "${index + 1}/$count";
    else if (this.options.mode === "Review(Auto)")
      this.stopTimer();
    this.onTestUpdated?.();
  }

  stopTimer() {
    this.subscription?.unsubscribe();
  }
}
