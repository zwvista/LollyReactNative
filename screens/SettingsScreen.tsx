import { container } from "tsyringe";
import { ChangeEvent, useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { SettingsService } from "../view-models/misc/settings.service.ts";
import { Button, Text, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import * as React from "react";

export default function SettingsScreen({ navigation }:any) {
  const [openLang, setOpenLang] = useState(false);
  const [openVoice, setOpenVoice] = useState(false);
  const [openDictReference, setOpenDictReference] = useState(false);
  const [openDictNote, setOpenDictNote] = useState(false);
  const [openDictTranslation, setOpenDictTranslation] = useState(false);
  const [openTextbook, setOpenTextbook] = useState(false);
  const [openUnitFrom, setOpenUnitFrom] = useState(false);
  const [openPartFrom, setOpenPartFrom] = useState(false);
  const [openToType, setOpenToType] = useState(false);
  const [openUnitTo, setOpenUnitTo] = useState(false);
  const [openPartTo, setOpenPartTo] = useState(false);
  const settingsService = container.resolve(SettingsService);
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const toTypeIsUnit = useMemo(() => settingsService.toType === 0, [settingsService.toType]);
  const toTypeIsPart = useMemo(() => settingsService.toType === 1, [settingsService.toType]);
  const toTypeIsTo = useMemo(() => settingsService.toType === 2, [settingsService.toType]);

  const onOpenPicker = useCallback((id: string) => {
    id !== "lang" && setOpenLang(false);
    id !== "voice" && setOpenVoice(false);
    id !== "dictReference" && setOpenDictReference(false);
    id !== "dictNote" && setOpenDictNote(false);
    id !== "dictTranslation" && setOpenDictTranslation(false);
    id !== "textbook" && setOpenTextbook(false);
    id !== "unitFrom" && setOpenUnitFrom(false);
    id !== "partFrom" && setOpenPartFrom(false);
    id !== "toType" && setOpenToType(false);
    id !== "unitTo" && setOpenUnitTo(false);
    id !== "partTo" && setOpenPartTo(false);
  }, []);

  const onLangChange = async (e: any) => {
    const index = settingsService.languages.findIndex(o => o.ID === e(settingsService.selectedLang.ID));
    settingsService.selectedLang = settingsService.languages[index];
    await settingsService.updateLang();
    forceUpdate();
  };

  const onVoiceChange = async (e: any) => {
    const index = settingsService.voices.findIndex(o => o.ID === e(settingsService.selectedVoice?.ID));
    settingsService.selectedVoice = settingsService.voices[index];
    await settingsService.updateVoice();
    forceUpdate();
  };

  const onDictReferenceChange = async (e: any) => {
    const index = settingsService.dictsReference.findIndex(o => o.ID === e(settingsService.selectedDictReference.ID));
    settingsService.selectedDictReference = settingsService.dictsReference[index];
    await settingsService.updateDictReference();
    forceUpdate();
  };

  const onDictNoteChange = async (e: any) => {
    const index = settingsService.dictsNote.findIndex(o => o.ID === e(settingsService.selectedDictNote?.ID));
    settingsService.selectedDictNote = settingsService.dictsNote[index];
    await settingsService.updateDictNote();
    forceUpdate();
  };

  const onDictTranslationChange = async (e: any) => {
    const index = settingsService.dictsTranslation.findIndex(o => o.ID === e(settingsService.selectedDictTranslation?.ID));
    settingsService.selectedDictTranslation = settingsService.dictsTranslation[index];
    await settingsService.updateDictTranslation();
    forceUpdate();
  };

  const onTextbookChange = async (e: any) => {
    const index = settingsService.textbooks.findIndex(o => o.ID === e(settingsService.selectedTextbook.ID));
    settingsService.selectedTextbook = settingsService.textbooks[index];
    await settingsService.updateTextbook();
    forceUpdate();
  };

  const onUnitFromChange = async (e: any) => {
    await settingsService.updateUnitFrom(e(settingsService.USUNITFROM));
    forceUpdate();
  };

  const onPartFromChange = async (e: any) => {
    await settingsService.updatePartFrom(e(settingsService.USPARTFROM));
    forceUpdate();
  };

  const onToTypeChange = async (e: any) => {
    await settingsService.updateToType(e(settingsService.toType));
    forceUpdate();
  };

  const previousUnitPart = async () => {
    await settingsService.previousUnitPart();
    forceUpdate();
  };

  const nextUnitPart = async () => {
    await settingsService.nextUnitPart();
    forceUpdate();
  };

  const onUnitToChange = async (e: any) => {
    await settingsService.updateUnitTo(e(settingsService.USUNITTO));
    forceUpdate();
  };

  const onPartToChange = async (e: any) => {
    await settingsService.updateUnitTo(e(settingsService.USPARTTO));
    forceUpdate();
  };

  useEffect(() => {
    (async () => {
      await settingsService.getData();
      forceUpdate();
    })();
  },[]);

  return (
    <View style={{padding: 8}}>
      <View style={{flexDirection: "row", alignItems: "center", zIndex: 8}}>
        <View style={{width: '30%'}}>
          <Text>Language:</Text>
        </View>
        <View style={{width: '70%'}}>
          <DropDownPicker
            open={openLang}
            onOpen={() => onOpenPicker("lang")}
            value={settingsService.selectedLang.ID}
            items={settingsService.languages.map(o => ({label: o.NAME, value: o.ID}))}
            setOpen={setOpenLang}
            setValue={onLangChange}
          />
        </View>
      </View>
      <View style={{flexDirection: "row", alignItems: "center", zIndex: 7, marginTop: 8}}>
        <View style={{width: '30%'}}>
          <Text>Voice:</Text>
        </View>
        <View style={{width: '70%'}}>
          <DropDownPicker
            open={openVoice}
            onOpen={() => onOpenPicker("voice")}
            value={settingsService.selectedVoice?.ID ?? null}
            items={settingsService.voices.map(o => ({label: o.VOICENAME, value: o.ID}))}
            setOpen={setOpenVoice}
            setValue={onVoiceChange}
          />
        </View>
      </View>
      <View style={{flexDirection: "row", alignItems: "center", zIndex: 6, marginTop: 8}}>
        <View style={{width: '30%'}}>
          <Text>Dictionary(Reference):</Text>
        </View>
        <View style={{width: '70%'}}>
          <DropDownPicker
            open={openDictReference}
            onOpen={() => onOpenPicker("dictReference")}
            value={settingsService.selectedDictReference?.ID ?? null}
            items={settingsService.dictsReference.map(o => ({label: o.NAME, value: o.ID}))}
            setOpen={setOpenDictReference}
            setValue={onDictReferenceChange}
          />
        </View>
      </View>
      <View style={{flexDirection: "row", alignItems: "center", zIndex: 5, marginTop: 8}}>
        <View style={{width: '30%'}}>
          <Text>Dictionary(Note):</Text>
        </View>
        <View style={{width: '70%'}}>
          <DropDownPicker
            open={openDictNote}
            onOpen={() => onOpenPicker("dictNote")}
            value={settingsService.selectedDictNote?.ID ?? null}
            items={settingsService.dictsNote.map(o => ({label: o.NAME, value: o.ID}))}
            setOpen={setOpenDictNote}
            setValue={onDictNoteChange}
          />
        </View>
      </View>
      <View style={{flexDirection: "row", alignItems: "center", zIndex: 4, marginTop: 8}}>
        <View style={{width: '30%'}}>
          <Text>Dictionary(Translation):</Text>
        </View>
        <View style={{width: '70%'}}>
          <DropDownPicker
            open={openDictTranslation}
            onOpen={() => onOpenPicker("dictTranslation")}
            value={settingsService.selectedDictTranslation?.ID ?? null}
            items={settingsService.dictsTranslation.map(o => ({label: o.NAME, value: o.ID}))}
            setOpen={setOpenDictTranslation}
            setValue={onDictTranslationChange}
          />
        </View>
      </View>
      <View style={{flexDirection: "row", alignItems: "center", zIndex: 3, marginTop: 8}}>
        <View style={{width: '30%'}}>
          <Text>Textbook:</Text>
        </View>
        <View style={{width: '70%'}}>
          <DropDownPicker
            open={openTextbook}
            onOpen={() => onOpenPicker("textbook")}
            value={settingsService.selectedTextbook?.ID ?? null}
            items={settingsService.textbooks.map(o => ({label: o.NAME, value: o.ID}))}
            setOpen={setOpenTextbook}
            setValue={onTextbookChange}
            disabled={toTypeIsUnit}
          />
        </View>
      </View>
      <View style={{flexDirection: "row", alignItems: "center", zIndex: 2, marginTop: 8}}>
        <View style={{width: '30%'}}>
          <Text>UNIT:</Text>
        </View>
        <View style={{width: '35%'}}>
          <DropDownPicker
            open={openUnitFrom}
            onOpen={() => onOpenPicker("unitFrom")}
            value={settingsService.USUNITFROM}
            items={settingsService.units}
            setOpen={setOpenUnitFrom}
            setValue={onUnitFromChange}
          />
        </View>
        <View style={{width: '35%'}}>
          <DropDownPicker
            open={openPartFrom}
            onOpen={() => onOpenPicker("partFrom")}
            value={settingsService.USPARTFROM}
            items={settingsService.parts}
            setOpen={setOpenPartFrom}
            setValue={onPartFromChange}
            disabled={toTypeIsUnit}
          />
        </View>
      </View>
      <View style={{flexDirection: "row", alignItems: "center", zIndex: 1, marginTop: 8}}>
        <View style={{width: '30%'}}>
          <DropDownPicker
            open={openToType}
            onOpen={() => onOpenPicker("toType")}
            value={settingsService.toType}
            items={settingsService.toTypes}
            setOpen={setOpenToType}
            setValue={onToTypeChange}
          />
        </View>
        <View style={{width: '35%'}}>
          <DropDownPicker
            open={openUnitTo}
            onOpen={() => onOpenPicker("unitTo")}
            value={settingsService.USUNITTO}
            items={settingsService.units}
            setOpen={setOpenUnitTo}
            setValue={onUnitToChange}
            disabled={!toTypeIsTo}
          />
        </View>
        <View style={{width: '35%'}}>
          <DropDownPicker
            open={openPartTo}
            onOpen={() => onOpenPicker("partTo")}
            value={settingsService.USPARTTO}
            items={settingsService.parts}
            setOpen={setOpenPartTo}
            setValue={onPartToChange}
            disabled={!toTypeIsTo}
          />
        </View>
      </View>
      <View style={{flexDirection: "row", alignItems: "center", zIndex: 0, marginTop: 8}}>
        <View style={{width: '30%'}} />
        <View style={{marginRight: 8}}>
          <Button title="Previous" onPress={previousUnitPart} />
        </View>
        <Button title="Next" onPress={nextUnitPart} />
      </View>
    </View>
  );
}
