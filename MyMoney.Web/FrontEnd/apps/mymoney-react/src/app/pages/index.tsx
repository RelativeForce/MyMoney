import RemainingBudgetChart from '../components/remaining-budget-chart';
import RunningTotalChart from '../components/running-total-chart';

export default function Home() {
   return (
      <>
         <RemainingBudgetChart></RemainingBudgetChart>
         <RunningTotalChart></RunningTotalChart>
      </>
   );
}
