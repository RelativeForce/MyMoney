import Chart from './chart';
import { IChartDataProvider } from '../interfaces/chart-data-provider';
import { useNavigate } from 'react-router-dom';
import { AsyncStatus, IYearSearch } from '../state/types';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRunningTotals, selectRunningTotals, selectSearchParameters, setSelectedYear } from '../state/running-total-chart';
import { useEffect, useMemo } from 'react';
import { IRunningTotalDto } from '@mymoney-common/api';
import { RunningTotalSeries, RunningTotalSeriesDataPoint } from '@mymoney-common/classes';

const LINE_COLOR = '#7aa3e5';

function buildSeries(runningTotals: IRunningTotalDto[]): RunningTotalSeries[] {
   const series = new RunningTotalSeries(0, LINE_COLOR);

   for (const runningTotal of runningTotals) {
      series.addEntry(runningTotal);
   }

   return [series];
}

function buildDataProvider(
   searchParameters: IYearSearch,
   data: RunningTotalSeries[],
   navigate: (url: string) => void,
   setYear: (year: number) => void
): IChartDataProvider<RunningTotalSeries, RunningTotalSeriesDataPoint> {
   return {
      chartTitle: `Total savings ${searchParameters.year}`,
      yAxisLabel: 'Balance (£)',
      data,
      leftButtons: [
         {
            icon: 'navigate_before',
            onClick: () => setYear(searchParameters.year - 1),
            tooltip: 'Previous year',
         },
      ],
      rightButtons: [
         {
            icon: 'navigate_next',
            onClick: () => setYear(searchParameters.year + 1),
            tooltip: 'Next year',
         },
      ],
      onClickDataPoint: (item: RunningTotalSeriesDataPoint) => {
         const parentId = item.runningTotal?.parentId ?? null;
         const hasId = item.id > 0;

         if (item.amount > 0) {
            if (parentId === null || hasId) {
               navigate(`/incomes/edit?id=${item.id}`);
            } else {
               navigate(`/incomes/edit-recurring?id=${item.id}`);
            }
         } else if (item.amount < 0) {
            if (parentId === null || hasId) {
               navigate(`/transactions/edit?id=${item.id}`);
            } else {
               navigate(`/transactions/edit-recurring?id=${item.id}`);
            }
         }
      },
      onClickSeries: (data: RunningTotalSeries) => {
         /* Do nothing */
      },
   };
}

export default function RunningTotalChart() {
   const navigate = useNavigate();
   const dispatch = useDispatch<any>();

   const runningTotals = useSelector(selectRunningTotals);
   const searchParameters = useSelector(selectSearchParameters);

   const series = useMemo(() => buildSeries(runningTotals.data), [runningTotals.data]);

   const setYear = (year: number) => dispatch(setSelectedYear(year));

   const dataProvider = buildDataProvider(searchParameters, series, navigate, setYear);

   useEffect(() => {
      const loading = runningTotals.status === AsyncStatus.loading;

      if (loading || (!loading && !searchParameters.refresh)) {
         return;
      }

      dispatch(fetchRunningTotals(searchParameters.year));
   }, [searchParameters.refresh, dispatch, runningTotals.status, searchParameters]);

   return <Chart dataProvider={dataProvider}></Chart>;
}
