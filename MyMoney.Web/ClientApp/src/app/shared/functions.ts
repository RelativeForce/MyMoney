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