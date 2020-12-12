export interface ISeriesItem {
   name: string;
   text: string;
   link: (string | number)[] | null;
   value: number;
   series: string;
   id: number;
   amount: number;
   date: string;
}
