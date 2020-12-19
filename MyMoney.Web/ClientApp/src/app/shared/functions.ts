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
