import * as React from 'react';
import { SettingsListener, SettingsService } from '../view-models/misc/settings.service';
import { SafeAreaView, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { container } from "tsyringe";

export default class SettingsScreen extends React.Component implements SettingsListener {

  settingsService = container.resolve(SettingsService);
  constructor(props: any) {
    super(props);
  }

  get toTypeIsUnit() {
    return this.settingsService.toType === 0;
  }
  get toTypeIsPart() {
    return this.settingsService.toType === 1;
  }
  get toTypeIsTo() {
    return this.settingsService.toType === 2;
  }

  styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  });

  async componentDidMount() {
    this.settingsService.settingsListener = this;
    await this.settingsService.getData();
  }

  render() {
    return (
      <SafeAreaView style={this.styles.container}>

      </SafeAreaView>
    );
  }

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
