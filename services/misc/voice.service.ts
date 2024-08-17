import { BaseService } from './base.service';
import { MVoice, MVoices } from '../../models/misc/voice';
import { singleton } from "tsyringe";
import { Platform } from "react-native";
import { MUSMapping } from "../../models/misc/usmapping.ts";

@singleton()
export class VoiceService extends BaseService {

  async getDataByLang(langid: number): Promise<MVoice[]> {
    const typeid = Platform.OS === 'ios' ? 3 : 4;
    const url = `${this.baseUrlAPI}VVOICES?filter=LANGID,eq,${langid}&filter=VOICETYPEID,eq,${typeid}`;
    const result = await this.httpGet<MVoices>(url);
    return result.records.map(value => Object.assign(new MVoice(), value));
  }
}
