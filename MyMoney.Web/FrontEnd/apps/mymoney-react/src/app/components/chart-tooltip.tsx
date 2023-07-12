import { ISeriesDataPoint } from '@mymoney-common/interfaces';
import { TooltipProps } from 'recharts';

function roundToDecimal(value: number): string {
   return (Math.round((value + Number.EPSILON) * 100) / 100).toFixed(2);
}

export default function ChartTooltip({
   active,
   payload,
}: TooltipProps<number, string>) {
   if (active && payload && payload.length) {
      const seriesValues = [];
      const dataPoint = payload[0].payload as ISeriesDataPoint;

      let index = 0;
      for (const dateChartPoint of payload) {
         const text = `${dateChartPoint.name} • £${roundToDecimal(
            dateChartPoint.value ?? 0
         )}`;

         seriesValues.push(
            <li
               key={index++}
               className="list-group-item"
               style={{ color: dateChartPoint.color }}
            >
               {text}
            </li>
         );
      }

      const title =
         dataPoint.id === -1
            ? dataPoint.text
            : `${dataPoint.text} • £${roundToDecimal(dataPoint.amount)}`;

      return (
         <div className="card">
            <div className="card-header">{title}</div>
            <ul className="list-group list-group-flush">{seriesValues}</ul>
         </div>
      );
   }

   return null;
}
