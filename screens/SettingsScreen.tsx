import * as React from 'react';
import { SettingsListener, SettingsService } from '../view-models/misc/settings.service';
import { Subscription } from 'rxjs';
import { SafeAreaView, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

export default class SettingsScreen extends React.Component implements SettingsListener {

  private settingsService = SettingsService.Instance;
  constructor(props: any) {
    super(props);
  }
  
  subscription = new Subscription();

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

  componentDidMount() {
    this.settingsService.settingsListener = this;
    this.subscription.add(this.settingsService.getData().subscribe());
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
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