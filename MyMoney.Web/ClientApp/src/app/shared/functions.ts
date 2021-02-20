import { Frequency } from './api';

export function groupBy<T, K>(list: T[], toKey: (item: T) => K): Map<K, T[]> {
   const map = new Map<K, T[]>();
   list.forEach((item: T) => {
      const key: K = toKey(item);
      const collection: T[] = map.get(key);
      if (!collection) {
         map.set(key, [item]);
      } else {
         collection.push(item);
      }
   });
   return map;
}

export function toInputDateString(text: string): string {
   const month = Number.parseInt(text.split('/')[1], 10);

   const monthStr = month < 10 ? '0' + month : month;

   const day = Number.parseInt(text.split('/')[0], 10);

   const dayStr = day < 10 ? '0' + day : day;

   return text.split('/')[2] + '-' + monthStr + '-' + dayStr;
}

export function randomColor(): string {
   return '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6);
}

export function toFrequencyString(frequency: Frequency): string {
   switch (frequency) {
      case Frequency.day: return 'Daily';
      case Frequency.week: return 'Weekly';
      case Frequency.fortnight: return 'Fortnightly';
      case Frequency.fourWeek: return 'Four weekly';
      case Frequency.month: return 'Monthly';
      case Frequency.year: return 'Annually';
   }
}

export const frequencyOptions: { key: Frequency; value: string }[] = [
   { key: Frequency.day, value: toFrequencyString(Frequency.day) },
   { key: Frequency.week, value: toFrequencyString(Frequency.week) },
   { key: Frequency.fortnight, value: toFrequencyString(Frequency.fortnight) },
   { key: Frequency.fourWeek, value: toFrequencyString(Frequency.fourWeek) },
   { key: Frequency.month, value: toFrequencyString(Frequency.month) },
   { key: Frequency.year, value: toFrequencyString(Frequency.year) },
];
