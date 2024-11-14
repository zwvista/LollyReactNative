import { MOnlineTextbook } from "../../models/misc/online-textbook.ts";

export class OnlineTextbooksWebPageService {
  constructor(public onlineTextbooks: MOnlineTextbook[],
              public selectedOnlineTextbookIndex: number) {}
  get selectedOnlineTextbook(): MOnlineTextbook {
    return this.onlineTextbooks[this.selectedOnlineTextbookIndex];
  }

  next(delta: number) {
    this.selectedOnlineTextbookIndex =
      (this.selectedOnlineTextbookIndex + delta + this.onlineTextbooks.length) % this.onlineTextbooks.length;
  }
}
