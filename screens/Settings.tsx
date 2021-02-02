import * as React from 'react';
import { Inject } from 'react.di';
import { SettingsListener, SettingsService } from '../view-models/settings.service';
import { Subscription } from 'rxjs';

export default class Settings extends React.Component implements SettingsListener {
  @Inject settingsService: SettingsService;
  subscription = new Subscription();


  onGetData(): void {
  }
  onUpdateLang(): void {
  }
  onUpdateTextbook(): void {
  }
  onUpdateDictReference(): void {
  }
  onUpdateDictNote(): void {
  }
  onUpdateDictTranslation(): void {
  }
  onUpdateVoice(): void {
  }
  onUpdateUnitFrom(): void {
  }
  onUpdatePartFrom(): void {
  }
  onUpdateUnitTo(): void {
  }
  onUpdatePartTo(): void {
  }
}