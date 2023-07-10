import { IChartDataProvider } from '../interfaces/chart-data-provider';
import {
   LineChart,
   Line,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   Legend,
   ResponsiveContainer,
} from 'recharts';
import ChartTooltip from './chart-tooltip';

export default function Chart({
   dataProvider,
}: {
   dataProvider: IChartDataProvider;
}) {
   const title = dataProvider.subChartTitle ? (
      <div>
         {dataProvider.chartTitle} - {dataProvider.subChartTitle}
      </div>
   ) : (
      <div>{dataProvider.chartTitle}</div>
   );

   const lines = [];

   for (const series of dataProvider.data) {
      lines.push(
         <Line
            type="monotone"
            dataKey="value"
            data={series.series}
            name={series.name}
            key={series.name}
            stroke={series.color}
            activeDot={{ r: 8 }}
         />
      );
   }

   return (
      <>
         <div className="container inline">
            <button
               className="btn btn-light btn-sm material-icons"
               type="button"
               onClick={dataProvider.previous}
               data-toggle="tooltip"
               data-placement="bottom"
               title="Previous"
            >
               navigate_before
            </button>
            <span className="ml-auto">{title}</span>
            <button
               className="btn btn-light btn-sm ml-auto material-icons"
               type="button"
               onClick={dataProvider.next}
               data-toggle="tooltip"
               data-placement="bottom"
               title="Next"
            >
               navigate_next
            </button>
         </div>
         <div
            style={{
               width: '100%',
               minHeight: '500px',
               maxHeight: '500px',
               marginBottom: '60px',
               height: '500px',
            }}
         >
            <ResponsiveContainer>
               <LineChart
                  data={dataProvider.data}
                  margin={{
                     top: 5,
                     right: 30,
                     left: 20,
                     bottom: 5,
                  }}
               >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                     dataKey="date"
                     type="category"
                     allowDuplicatedCategory={false}
                  />
                  <YAxis />
                  <Tooltip content={ChartTooltip(dataProvider.onSelect)} />
                  <Legend />
                  {lines}
               </LineChart>
            </ResponsiveContainer>
         </div>
      </>
   );
}
