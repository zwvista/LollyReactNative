/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { Global } from "typedin";
import { WordsUnitService } from './view-models/words-unit.service';
import { AppService } from './view-models/app.service';
import { UserSettingService } from './services/misc/user-setting.service';
import { DictionaryService } from './services/misc/dictionary.service';
import { TextbookService } from './services/misc/textbook.service';
import { HtmlService } from './services/misc/html.service';
import { PhrasesUnitService } from './view-models/phrases-unit.service';
import { UnitPhraseService } from './services/wpp/unit-phrase.service';
import { LanguageService } from './services/misc/language.service';
import { UnitWordService } from './services/wpp/unit-word.service';
import { SettingsService } from './view-models/settings.service';
import { AutoCorrectService } from './services/misc/autocorrect.service';
import { LangPhraseService } from './services/wpp/lang-phrase.service';
import { LangWordService } from './services/wpp/lang-word.service';
import { WordsLangService } from './view-models/words-lang.service';
import { PhrasesLangService } from './view-models/phrases-lang.service';
import { NoteService } from './view-models/note.service';
import { VoicesService } from './services/misc/voices.service';
import { WordFamiService } from './services/wpp/word-fami.service';
import { WordsFamiService } from './view-models/words-fami.service';
import { UsMappingService } from './services/misc/us-mapping.service';
import { PatternService } from './services/wpp/pattern.service';
import { PatternsService } from './view-models/patterns.service';

Global.register(DictionaryService, new DictionaryService());
Global.register(HtmlService, new HtmlService());
Global.register(LanguageService, new LanguageService());
Global.register(TextbookService, new TextbookService());
Global.register(UnitPhraseService, new UnitPhraseService());
Global.register(UnitWordService, new UnitWordService());
Global.register(UserSettingService, new UserSettingService());
Global.register(AppService, new AppService());
Global.register(PhrasesUnitService, new PhrasesUnitService());
Global.register(SettingsService, new SettingsService());
Global.register(WordsUnitService, new WordsUnitService());
Global.register(AutoCorrectService, new AutoCorrectService());
Global.register(LangPhraseService, new LangPhraseService());
Global.register(LangWordService, new LangWordService());
Global.register(PhrasesLangService, new PhrasesLangService());
Global.register(WordsLangService, new WordsLangService());
Global.register(NoteService, new NoteService());
Global.register(WordFamiService, new WordFamiService());
Global.register(WordsFamiService, new WordsFamiService());
Global.register(VoicesService, new VoicesService());
Global.register(UsMappingService, new UsMappingService());
Global.register(PatternService, new PatternService());
Global.register(PatternsService, new PatternsService());

AppRegistry.registerComponent(appName, () => App);
