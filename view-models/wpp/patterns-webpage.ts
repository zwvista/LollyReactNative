import { MPattern } from "../../models/wpp/pattern.ts";

export class PatternsWebPageService {
  constructor(public patterns: MPattern[],
              public selectedPatternIndex: number) {}
  get selectedPattern(): MPattern {
    return this.patterns[this.selectedPatternIndex];
  }

  next(delta: number) {
    this.selectedPatternIndex =
      (this.selectedPatternIndex + delta + this.patterns.length) % this.patterns.length;
  }
}
