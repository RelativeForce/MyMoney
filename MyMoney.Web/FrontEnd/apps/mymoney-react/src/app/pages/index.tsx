import Chart from '../components/chart';
import { IChartDataProvider } from '../interfaces/chart-data-provider';
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
import { BudgetSeries, BudgetSeriesDataPoint } from '@mymoney-common/classes';
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
): BudgetSeries[] {
   const data = [];

   for (let index = 0; index < budgets.length; index++) {
      const color = colors.length > index ? colors[index] : randomColor();
      const bs = new BudgetSeries(budgets[index], color);

      for (const transaction of transactions) {
         bs.addEntry(transaction);
      }

      data[data.length] = bs;
   }

   return data;
}

function buildRemainingBudget(
   searchParameters: IBudgetsSearch,
   data: BudgetSeries[],
   navigate: (url: string) => void,
   setMonth: (month: number, year: number) => void
): IChartDataProvider<BudgetSeries, BudgetSeriesDataPoint> {
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
      onClickDataPoint: (data: BudgetSeriesDataPoint) => {
         navigate(`/transactions/edit?id=${data.id}`);
      },
      onClickSeries: (data: BudgetSeries) => {
         navigate(`/budgets/edit?id=${data.budget.id}`);
      }
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
      [transactions.data, budgets.data]
   );

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

      const search: IBudgetSearchDto = searchParameters;

      dispatch(fetchChartBudgets({ search }));
      dispatch(fetchChartTransactions({ search }));
   }, [searchParameters.refresh, dispatch, transactions.status, budgets.status, searchParameters]);

   return <Chart dataProvider={dataProvider}></Chart>;
}
