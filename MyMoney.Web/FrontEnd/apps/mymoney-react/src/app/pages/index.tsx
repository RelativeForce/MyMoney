import { ISeriesDataPoint } from '@mymoney-common/interfaces';
import Chart from '../components/chart';
import {
   IChartDataProvider,
   IColoredSeries,
} from '../interfaces/chart-data-provider';
import { useNavigate } from 'react-router-dom';
import { AsyncStatus, IBudgetsSearch } from '../state/types';
import { useDispatch, useSelector } from 'react-redux';
import {
   fetchChartBudgets,
   fetchChartTransactions,
   selectChartBudgets,
   selectChartTransactions,
   selectRemainingBudgetSearchParameters,
   setSelectedMonth,
} from '../state/remaining-budget-chart-slice';
import { useEffect, useMemo } from 'react';
import {
   IBudgetDto,
   IBudgetSearchDto,
   ITransactionDto,
} from '@mymoney-common/api';
import { BudgetSeries } from '@mymoney-common/classes';
import { randomColor } from '@mymoney-common/functions';

const colors = [
   '#5AA454',
   '#783320',
   '#DB2E2E',
   '#7aa3e5',
   '#a8385d',
   '#aae3f5',
];

function monthAsDate(searchParameters: IBudgetsSearch): Date {
   const month = new Date();

   month.setDate(1);
   month.setMonth(searchParameters.month - 1);
   month.setFullYear(searchParameters.year);

   return month;
}

function getSeries(
   budgets: IBudgetDto[],
   transactions: ITransactionDto[]
): IColoredSeries[] {
   const data = [];

   let index = 0;
   for (const budget of budgets) {
      const bs = new BudgetSeries(budget);

      for (const transaction of transactions) {
         bs.addEntry(transaction);
      }

      data[data.length] = {
         ...bs,
         color: colors.length > index ? colors[index] : randomColor(),
      };
      index++;
   }

   return data;
}

function buildRemainingBudget(
   searchParameters: IBudgetsSearch,
   data: IColoredSeries[],
   navigate: (url: string) => void,
   setMonth: (month: number, year: number) => void
): IChartDataProvider {
   const date = monthAsDate(searchParameters);
   const monthString = date.toLocaleString('default', { month: 'long' });
   const subChartTitle = `${monthString} ${date.getFullYear()}`;

   return {
      chartTitle: 'Transactions',
      yAxisLabel : 'Remaining in budget (£)',
      subChartTitle,
      data,
      next: () => {
         date.setMonth(date.getMonth() + 1);

         setMonth(date.getMonth(), date.getFullYear());
      },
      previous: () => {
         date.setMonth(date.getMonth() - 1);

         setMonth(date.getMonth(), date.getFullYear());
      },
      onSelect: (data: ISeriesDataPoint) => {
         if (data.link === null) {
            return;
         }

         navigate(data.link.join('/'));
      },
   };
}

export default function Home() {
   const navigate = useNavigate();
   const dispatch = useDispatch<any>();

   const transactions = useSelector(selectChartTransactions);
   const budgets = useSelector(selectChartBudgets);
   const searchParameters = useSelector(selectRemainingBudgetSearchParameters);

   const series = useMemo(
      () => getSeries(budgets.data, transactions.data),
      [transactions, budgets]
   );

   console.log(series);

   const setMonth = (month: number, year: number) =>
      dispatch(setSelectedMonth(year, month + 1));

   const dataProvider = buildRemainingBudget(
      searchParameters,
      series,
      navigate,
      setMonth
   );

   useEffect(() => {
      const loading =
         transactions.status === AsyncStatus.loading ||
         budgets.status === AsyncStatus.loading;

      if (loading || (!loading && !searchParameters.refresh)) {
         return;
      }

      const search: IBudgetSearchDto = {
         year: searchParameters.year,
         month: searchParameters.month,
      };

      dispatch(fetchChartBudgets({ search }));
      dispatch(fetchChartTransactions({ search }));
   }, [searchParameters, dispatch]);

   return <Chart dataProvider={dataProvider}></Chart>;
}
