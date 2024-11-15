import { WordFamiService } from "../../services/wpp/word-fami.service.ts";
import { singleton } from "tsyringe";
import { UnitWordService } from "../../services/wpp/unit-word.service.ts";
import { interval, Subscription } from "rxjs";
import { MUnitWord } from "../../models/wpp/unit-word.ts";
import { MReviewOptions } from "../../models/misc/review-options.ts";
import { SettingsService } from "../misc/settings.service.ts";
import _ from "lodash";
import { HtmlService } from "../../services/misc/html.service.ts";

@singleton()
export default class WordsReviewService {

  constructor(private unitWordService: UnitWordService,
              private wordFamiService: WordFamiService,
              private settingsService: SettingsService) {
  }

  lstWords: MUnitWord[] = [];
  get count(): number {
    return this.lstWords.length;
  }
  lstCorrectIDs: number[] = [];
  index = 0;
  get hasCurrent(): boolean {
    return !!this.lstWords.length && (this.onRepeat || this.index >= 0 && this.index < this.count);
  }
  get currentItem(): MUnitWord | undefined {
    return this.hasCurrent ? this.lstWords[this.index] : undefined;
  }
  get currentWord(): string {
    return this.hasCurrent ? this.lstWords[this.index].WORD : "";
  }
  options = new MReviewOptions()
  get isTestMode(): boolean {
    return this.options.mode == "Test" || this.options.mode == "Textbook";
  }
  subscription?: Subscription;
  showOptions = true;
  optionsDone = false;
  inputFocused = false;

  isSpeaking = true;
  indexString = "";
  indexVisible = true;
  correctVisible = false;
  incorrectVisible = false;
  accuracyString = "";
  accuracyVisible = true;
  checkNextEnabled = false;
  checkNextStringRes = "Check";
  checkPrevEnabled = false;
  checkPrevStringRes = "Check";
  checkPrevVisible = true;
  wordTargetString = "";
  noteTargetString = "";
  wordHintString = "";
  wordTargetVisible = true;
  noteTargetVisible = true;
  wordHintVisible = true;
  translationString = "";
  wordInputString = "";
  onRepeat = true;
  moveForward = true;
  onRepeatVisible = true;
  moveForwardVisible = true;

  async newTest() {
    const f = async () => {
      this.index = this.moveForward ? 0 : this.count - 1;
      await this.doTest();
      this.checkNextStringRes = this.isTestMode ? "Check" : "Next";
      this.checkPrevStringRes = this.isTestMode ? "Check" : "Prev";
    };
    this.lstWords = [];
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
      const lst = await this.unitWordService.getDataByTextbook(this.settingsService.selectedTextbook)
      const lst2: MUnitWord[] = [];
      lst.forEach(o => {
        const s = o.ACCURACY;
        const percentage = !s.endsWith("%") ? 0.0 : +_.trimEnd(s, '%');
        const t = 6 - Math.floor(percentage / 20.0);
        for (let i = 0; i < t; i++)
          lst2.push(o);
      });
      this.lstWords = [];
      const cnt = Math.min(this.options.reviewCount, lst.length);
      while (this.lstWords.length < cnt) {
        const o = _.sample(lst2)!
        if (!this.lstWords.includes(o))
          this.lstWords.push(o);
      }
      await f();
    } else {
      this.lstWords = await this.unitWordService.getDataByTextbookUnitPart(
        this.settingsService.selectedTextbook, this.settingsService.USUNITPARTFROM,
        this.settingsService.USUNITPARTTO, '', 0);
      const nFrom = this.count * (this.options.groupSelected - 1) / this.options.groupCount
      const nTo = this.count * this.options.groupSelected / this.options.groupCount
      this.lstWords = this.lstWords.slice(nFrom, nTo)
      if (this.options.shuffled) this.lstWords = _.shuffle(this.lstWords);
      await f();
      if (this.options.mode === "Review(Auto)")
        this.subscription = interval(this.options.interval).subscribe(_ => {
          this.check(true);
        });
    }
  }

  move(toNext: boolean) {
    const checkOnRepeat = () => {
      if (this.onRepeat) {
        this.index = (this.index + this.count) % this.count;
      }
    };
    if (this.moveForward == toNext) {
      this.index++;
      checkOnRepeat();
      if (this.isTestMode && !this.hasCurrent) {
        this.index = 0;
        this.lstWords = this.lstWords.filter(o => !this.lstCorrectIDs.includes(o.ID));
      }
    } else {
      this.index--;
      checkOnRepeat();
    }
  }

  private async getTranslation(): Promise<string> {
    const dictTranslation = this.settingsService.selectedDictTranslation!;
    const url = dictTranslation.urlString(this.currentWord, this.settingsService.autoCorrects);
    const html = await this.settingsService.getHtml(url);
    return HtmlService.extractTextFrom(html, dictTranslation.TRANSFORM, "", (text, _) => text);
  }

  async check(toNext: boolean) {
    if (!this.isTestMode) {
      let b = true;
      if (this.options.mode == "Review(Manual)" && !!this.wordInputString && this.wordInputString !== this.currentWord) {
        b = false;
        this.incorrectVisible = true;
      }
      if (b) {
        this.move(toNext);
        await this.doTest();
      }
    } else if (!this.correctVisible && !this.incorrectVisible) {
      this.wordInputString = this.settingsService.autoCorrectInput(this.wordInputString);
      this.wordTargetVisible = true;
      if (this.wordInputString == this.currentWord)
        this.correctVisible = true;
      else
        this.incorrectVisible = true;
      this.wordHintVisible = false;
      this.checkNextStringRes = "Next";
      this.checkPrevStringRes = "Prev";
      if (!this.hasCurrent) return;
      const o = this.currentItem!;
      const isCorrect = o.WORD === this.wordInputString;
      if (isCorrect) this.lstCorrectIDs.push(o.ID);
      const o2 = await this.wordFamiService.updateWordFami(o.WORDID, isCorrect);
      o.CORRECT = o2.CORRECT;
      o.TOTAL = o2.TOTAL;
      this.accuracyString = o.ACCURACY;
    } else {
      this.move(toNext);
      await this.doTest();
      this.checkNextStringRes = "Check";
      this.checkPrevStringRes = "Check";
    }
  }

  private async doTest() {
    this.indexVisible = this.hasCurrent;
    this.correctVisible = false;
    this.incorrectVisible = false;
    this.accuracyVisible = this.isTestMode && this.hasCurrent;
    this.checkNextEnabled = this.hasCurrent;
    this.checkPrevEnabled = this.hasCurrent;
    this.wordTargetString = this.currentWord;
    this.noteTargetString = this.currentItem?.NOTE ?? "";
    this.wordTargetVisible = !this.isTestMode;
    this.noteTargetVisible = !this.isTestMode;
    this.wordHintString = this.currentItem?.WORD?.length?.toString() ?? "";
    this.wordHintVisible = this.isTestMode;
    this.translationString = "";
    this.wordInputString = "";
    this.inputFocused = true;
    if (this.hasCurrent && this.isSpeaking)
      this.settingsService.speak(this.currentWord);
    if (this.hasCurrent) {
      this.indexString = `${this.index + 1}/${this.count}`;
      this.accuracyString = this.currentItem!.ACCURACY;
      this.translationString = await this.getTranslation();
      if (!this.translationString && !this.options.speakingEnabled)
        this.wordInputString = this.currentWord;
    } else if (this.options.mode === "Review(Auto)")
      this.stopTimer();
  }

  private stopTimer() {
    this.subscription?.unsubscribe();
  }
}
