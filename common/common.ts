import _ from 'lodash';
import { Linking } from "react-native";

// https://stackoverflow.com/questions/43804032/open-url-in-default-web-browser
export async function googleString(str: string) {
  await Linking.openURL('https://www.google.com/search?q=' + encodeURIComponent(str));
}

export function toParameters(item: Object): Object {
  // @ts-ignore
  return _.mapKeys(item, (v, k) => 'P_' + k);
}

export function getPreferredRangeFromArray(
  index: number,
  length: number,
  preferredLength: number
): [number, number] {
  let start, end;
  if (length < preferredLength) {
    start = 0; end = length;
  } else {
    start = index - preferredLength / 2; end = index + preferredLength / 2;
    if (start < 0) {
      end -= start; start = 0;
    }
    if (end > length) {
      start -= end - length; end = length;
    }
  }
  return [start, end];
}

export class GlobalVars {
  public static userid = '';
}
