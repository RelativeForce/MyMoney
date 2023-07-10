import { ISeriesDataPoint } from '@mymoney-common/interfaces';
import { TooltipProps } from 'recharts';

export default function ChartTooltip(onSelect: (data: ISeriesDataPoint) => void) {
   return ({
      active,
      payload,
      trigger,
   }: TooltipProps<(string | number)[], string>) => {
      if (active && payload && payload.length) {
         const seriesValues = [];
         const dataPoint = payload[0].payload as ISeriesDataPoint;

         if (trigger === 'click') {
            onSelect(dataPoint);
         }

         for (const dateChartPoint of payload) {
            seriesValues.push(
               <p
                  style={{ color: dateChartPoint.color }}
               >{`${dateChartPoint.name}: £${dateChartPoint.value}`}</p>
            );
         }

         return (
            <div>
               <p>Amount: £{dataPoint.amount}</p>
               {seriesValues}
            </div>
         );
      }

      return null;
   };
}
