export interface ISeriesDataPoint {

   /**
    * The name id used by the chart to group data points.
    */
   readonly name: string;
   readonly id: number;
   readonly text: string;
   readonly value: number;
   readonly amount: number;
   readonly date: string;
}
