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
import { ISeries, ISeriesDataPoint } from '@mymoney-common/interfaces';

export default function Chart<
   TSeries extends ISeries<TDataPoint>,
   TDataPoint extends ISeriesDataPoint
>({ dataProvider }: { dataProvider: IChartDataProvider<TSeries, TDataPoint> }) {
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
            activeDot={{
               r: 5,
               className: 'click-cursor',
               onClick: (_, dotData: any) => {
                  const dataPoint: TDataPoint = dotData.payload;

                  if (dataPoint.id === -1) {
                     dataProvider.onClickSeries(series);
                     return;
                  }

                  dataProvider.onClickDataPoint(dataPoint);
               },
            }}
            dot={{ r: 0 }}
         ></Line>
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
                     dataKey="id"
                     type="category"
                     allowDuplicatedCategory={false}
                     hide={true}
                  />
                  <YAxis />
                  <Tooltip content={ChartTooltip} />
                  <Legend />
                  {lines}
               </LineChart>
            </ResponsiveContainer>
         </div>
      </>
   );
}
