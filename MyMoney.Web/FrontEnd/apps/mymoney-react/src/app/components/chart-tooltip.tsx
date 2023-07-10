import { ISeriesDataPoint } from '@mymoney-common/interfaces';
import { TooltipProps } from 'recharts';

export default function ChartTooltip(
   onSelect: (data: ISeriesDataPoint) => void
) {
   return ({ active, payload }: TooltipProps<(string | number)[], string>) => {
      if (active && payload && payload.length) {
         const seriesValues = [];
         const dataPoint = payload[0].payload as ISeriesDataPoint;

         for (const dateChartPoint of payload) {
            seriesValues.push(
               <li
                  className="list-group-item"
                  style={{ color: dateChartPoint.color }}
               >
                  {`${dateChartPoint.name} • £${dateChartPoint.value}`}
               </li>
            );
         }

         const title =
            dataPoint.id === -1
               ? dataPoint.text
               : `${dataPoint.text} • £${dataPoint.amount}`;

         return (
            <div className="card">
               <div className="card-header">{title}</div>
               <ul className="list-group list-group-flush">{seriesValues}</ul>
            </div>
         );
      }

      return null;
   };
}
