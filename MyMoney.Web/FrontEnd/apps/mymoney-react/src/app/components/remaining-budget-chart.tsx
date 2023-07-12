import Chart from './chart';
import { IChartDataProvider } from '../interfaces/chart-data-provider';
import { useNavigate } from 'react-router-dom';
import { AsyncStatus, IMonthSearch } from '../state/types';
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
import { IBudgetDto, IBudgetSearchDto, ITransactionDto } from '@mymoney-common/api';
import { BudgetSeries, BudgetSeriesDataPoint } from '@mymoney-common/classes';
import { randomColor } from '@mymoney-common/functions';

const colors = ['#5AA454', '#783320', '#DB2E2E', '#7aa3e5', '#a8385d', '#aae3f5'];

function monthAsDate(searchParameters: IMonthSearch): Date {
   const month = new Date();

   month.setDate(1);
   month.setMonth(searchParameters.month - 1);
   month.setFullYear(searchParameters.year);

   return month;
}

function buildSeries(budgets: IBudgetDto[], transactions: ITransactionDto[]): BudgetSeries[] {
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

function buildDataProvider(
   searchParameters: IMonthSearch,
   data: BudgetSeries[],
   navigate: (url: string) => void,
   setMonth: (month: number, year: number) => void
): IChartDataProvider<BudgetSeries, BudgetSeriesDataPoint> {
   const date = monthAsDate(searchParameters);
   const monthString = date.toLocaleString('default', { month: 'long' });

   function updateDate(isYear: boolean, increment: number) {
      if (isYear) {
         date.setFullYear(date.getFullYear() + increment);
      } else {
         date.setMonth(date.getMonth() + increment);
      }

      setMonth(date.getMonth(), date.getFullYear());
   }

   return {
      chartTitle: `Transactions - ${monthString} ${date.getFullYear()}`,
      yAxisLabel: 'Remaining in budget (£)',
      data,
      leftButtons: [
         {
            icon: 'keyboard_double_arrow_left',
            onClick: () => updateDate(true, -1),
            tooltip: 'Previous year',
         },
         {
            icon: 'navigate_before',
            onClick: () => updateDate(false, -1),
            tooltip: 'Previous month',
         },
      ],
      rightButtons: [
         {
            icon: 'navigate_next',
            onClick: () => updateDate(false, 1),
            tooltip: 'Next month',
         },
         {
            icon: 'keyboard_double_arrow_right',
            onClick: () => updateDate(true, 1),
            tooltip: 'Next year',
         },
      ],
      onClickDataPoint: (data: BudgetSeriesDataPoint) => navigate(`/transactions/edit?id=${data.id}`),
      onClickSeries: (data: BudgetSeries) => navigate(`/budgets/edit?id=${data.budget.id}`),
   };
}

export default function RemainingBudgetChart() {
   const navigate = useNavigate();
   const dispatch = useDispatch<any>();

   const transactions = useSelector(selectChartTransactions);
   const budgets = useSelector(selectChartBudgets);
   const searchParameters = useSelector(selectRemainingBudgetSearchParameters);

   const series = useMemo(() => buildSeries(budgets.data, transactions.data), [transactions.data, budgets.data]);

   const setMonth = (month: number, year: number) => dispatch(setSelectedMonth(year, month + 1));

   const dataProvider = buildDataProvider(searchParameters, series, navigate, setMonth);

   useEffect(() => {
      const loading = transactions.status === AsyncStatus.loading || budgets.status === AsyncStatus.loading;

      if (loading || (!loading && !searchParameters.refresh)) {
         return;
      }

      const search: IBudgetSearchDto = searchParameters;

      dispatch(fetchChartBudgets({ search }));
      dispatch(fetchChartTransactions({ search }));
   }, [searchParameters.refresh, dispatch, transactions.status, budgets.status, searchParameters]);

   return <Chart dataProvider={dataProvider}></Chart>;
}
