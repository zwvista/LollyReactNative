import _ from 'lodash';

// https://stackoverflow.com/questions/42775017/angular-2-redirect-to-an-external-url-and-open-in-a-new-tab
export function googleString(str: string) {
  window.open('https://www.google.com/search?q=' + encodeURIComponent(str), '_blank');
}

export function toParameters(item: Object): Object {
  // @ts-ignore
  return _.mapKeys(item, (v, k) => 'P_' + k);
}

export function getPreferredRangeFromArray(
  index: number,
  length: number,
  preferredLength: number
): number[] {
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
