import { MDictionary } from "../models/misc/dictionary.ts";
import { Dispatch, SetStateAction } from "react";
import { SettingsService } from "../view-models/misc/settings.service.ts";

type DictWebViewStatus = "Ready" | "Navigating" | "Automating";

export default class OnlineDict {

  dictStatus: DictWebViewStatus = "Ready";

  constructor(private settingsService: SettingsService) {
  }

  async searchDict(word: string, item: MDictionary, setWebViewSource: Dispatch<SetStateAction<any>>) {
    const url = item.urlString(word, this.settingsService.autoCorrects)
    if (item.DICTTYPENAME == "OFFLINE") {
      const s = await this.settingsService.getHtml(url);
      const str = item.htmlString(s, word);
      setWebViewSource({html: str});
    } else {
      setWebViewSource({uri: url});
      if (item.AUTOMATION)
        this.dictStatus = "Automating";
      else if (item.DICTTYPENAME == "OFFLINE-ONLINE")
        this.dictStatus = "Navigating";
    }
  }

  initWebViewClient() {
    // this.wv.webViewClient = object : WebViewClient() {
    //   override fun onPageFinished(view: WebView, url: string) {
    //     if (this.dictStatus == "Ready") return
    //     const item = iOnlineDict.getDict
    //     if (this.dictStatus == "Automating") {
    //       const s = item.automation.replace("{0}", iOnlineDict.getWord)
    //       this.wv.injectJavaScript(s) {
    //         this.dictStatus = "Ready"
    //         if (item.dicttypename == "OFFLINE-ONLINE")
    //           this.dictStatus = "Navigating"
    //       }
    //     } else if (this.dictStatus == "Navigating") {
    //       this.wv.injectJavaScript("document.documentElement.outerHTML.toString()") {
    //         const html = it.replace("\\u003C", "<")
    //           .replace("\\\"", "\"")
    //           .replace("\\n", "\n")
    //           .replace("\\r", "\r")
    //           .replace("\\t", "\t")
    //         Log.d("HTML", html)
    //         const str = item.htmlString(html, iOnlineDict.getWord, true)
    //         this.wv.loadDataWithBaseURL("", str, "text/html", "UTF-8", "")
    //         this.dictStatus = "Ready"
    //       }
    //     }
    //   }
    // }
  }
}
