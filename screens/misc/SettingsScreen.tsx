import { container } from "tsyringe";
import { useEffect, useMemo, useReducer } from "react";
import { SettingsService } from "../../view-models/misc/settings.service.ts";
import { Animated, Button, StyleSheet, Text, View } from "react-native";
import * as React from "react";
import { Dropdown } from "react-native-element-dropdown";
import { MLanguage } from "../../models/misc/language.ts";
import { MVoice } from "../../models/misc/voice.ts";
import { MDictionary } from "../../models/misc/dictionary.ts";
import { MTextbook } from "../../models/misc/textbook.ts";
import { MSelectItem } from "../../common/selectitem.ts";
import StylesApp from "../../components/StylesApp.ts";
import ScrollView = Animated.ScrollView;

export default function SettingsScreen({ navigation }:any) {
  const settingsService = container.resolve(SettingsService);
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const toTypeIsUnit = useMemo(() => settingsService.toType === 0, [settingsService.toType]);
  const toTypeIsPart = useMemo(() => settingsService.toType === 1, [settingsService.toType]);
  const toTypeIsTo = useMemo(() => settingsService.toType === 2, [settingsService.toType]);

  const onLangChange = async (e: MLanguage) => {
    settingsService.selectedLang = e;
    await settingsService.updateLang();
    forceUpdate();
  };

  const onVoiceChange = async (e: MVoice) => {
    settingsService.selectedVoice = e;
    await settingsService.updateVoice();
    forceUpdate();
  };

  const onDictReferenceChange = async (e: MDictionary) => {
    settingsService.selectedDictReference = e;
    await settingsService.updateDictReference();
    forceUpdate();
  };

  const onDictNoteChange = async (e: MDictionary) => {
    settingsService.selectedDictNote = e;
    await settingsService.updateDictNote();
    forceUpdate();
  };

  const onDictTranslationChange = async (e: MDictionary) => {
    settingsService.selectedDictTranslation = e;
    await settingsService.updateDictTranslation();
    forceUpdate();
  };

  const onTextbookChange = async (e: MTextbook) => {
    settingsService.selectedTextbook = e;
    await settingsService.updateTextbook();
    forceUpdate();
  };

  const onUnitFromChange = async (e: MSelectItem) => {
    await settingsService.updateUnitFrom(e.value);
    forceUpdate();
  };

  const onPartFromChange = async (e: MSelectItem) => {
    await settingsService.updatePartFrom(e.value);
    forceUpdate();
  };

  const onToTypeChange = async (e: MSelectItem) => {
    await settingsService.updateToType(e.value);
    forceUpdate();
  };

  const previousunitPart = async () => {
    await settingsService.previousUnitPart();
    forceUpdate();
  };

  const nextunitPart = async () => {
    await settingsService.nextUnitPart();
    forceUpdate();
  };

  const onUnitToChange = async (e: MSelectItem) => {
    await settingsService.updateUnitTo(e.value);
    forceUpdate();
  };

  const onPartToChange = async (e: MSelectItem) => {
    await settingsService.updateUnitTo(e.value);
    forceUpdate();
  };

  useEffect(() => {
    (async () => {
      await settingsService.getData();
      forceUpdate();
    })();
  },[]);

  return (
    <ScrollView className="flex-1 p-2">
      <Text>Language:</Text>
      <Dropdown
        style={StylesApp.dropdown}
        labelField="NAME"
        valueField="ID"
        value={settingsService.selectedLang}
        data={settingsService.languages}
        onChange={onLangChange}
      />
      <Text>Voice:</Text>
      <Dropdown
        style={StylesApp.dropdown}
        labelField="VOICELANG"
        valueField="ID"
        value={settingsService.selectedVoice}
        data={settingsService.voices}
        onChange={onVoiceChange}
      />
      <Text>Dictionary(Reference):</Text>
      <Dropdown
        style={StylesApp.dropdown}
        labelField="NAME"
        valueField="ID"
        value={settingsService.selectedDictReference}
        data={settingsService.dictsReference}
        onChange={onDictReferenceChange}
      />
      <Text>Dictionary(Note):</Text>
      <Dropdown
        style={StylesApp.dropdown}
        labelField="NAME"
        valueField="ID"
        value={settingsService.selectedDictNote}
        data={settingsService.dictsNote}
        onChange={onDictNoteChange}
      />
      <Text>Dictionary(Translation):</Text>
      <Dropdown
        style={StylesApp.dropdown}
        labelField="NAME"
        valueField="ID"
        value={settingsService.selectedDictTranslation}
        data={settingsService.dictsTranslation}
        onChange={onDictTranslationChange}
      />
      <Text>Textbook:</Text>
      <Dropdown
        style={StylesApp.dropdown}
        labelField="NAME"
        valueField="ID"
        value={settingsService.selectedTextbook}
        data={settingsService.textbooks}
        onChange={onTextbookChange}
      />
      <Text>UNIT:</Text>
      <Dropdown
        style={StylesApp.dropdown}
        labelField="label"
        valueField="value"
        value={settingsService.units.find(o => o.value === settingsService.USUNITFROM)}
        data={settingsService.units}
        onChange={onUnitFromChange}
      />
      <Dropdown
        style={[StylesApp.dropdown, toTypeIsUnit && StylesApp.dropdownDisable]}
        labelField="label"
        valueField="value"
        value={settingsService.parts.find(o => o.value === settingsService.USPARTFROM)}
        data={settingsService.parts}
        onChange={onPartFromChange}
        disable={toTypeIsUnit}
      />
      <View style={StylesApp.row}>
        <View className="flex-1">
          <Dropdown
            style={StylesApp.dropdown}
            labelField="label"
            valueField="value"
            value={settingsService.toTypes.find(o => o.value === settingsService.toType)}
            data={settingsService.toTypes}
            onChange={onToTypeChange}
          />
        </View>
        <View className="flex-1 ml-2">
          <Button title="Previous" onPress={previousunitPart} />
        </View>
        <View className="flex-1 ml-2">
          <Button title="Next" onPress={nextunitPart} />
        </View>
      </View>
      <Dropdown
        style={[StylesApp.dropdown, !toTypeIsTo && StylesApp.dropdownDisable]}
        labelField="label"
        valueField="value"
        value={settingsService.units.find(o => o.value === settingsService.USUNITTO)}
        data={settingsService.units}
        onChange={onUnitToChange}
        disable={!toTypeIsTo}
      />
      <Dropdown style={[StylesApp.dropdown, !toTypeIsTo && StylesApp.dropdownDisable]}
        labelField="label"
        valueField="value"
        value={settingsService.parts.find(o => o.value === settingsService.USPARTTO)}
        data={settingsService.parts}
        onChange={onPartToChange}
        disable={!toTypeIsTo}
      />
    </ScrollView>
  );
}
