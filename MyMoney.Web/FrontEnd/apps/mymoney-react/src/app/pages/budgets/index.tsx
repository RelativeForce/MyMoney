import { Link } from 'react-router-dom';
import { ChangeEventHandler } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import InlineInput from '../../components/inline-input';
import BasicBudgetButtons from '../../components/basic-budget-buttons';
import { maxValidator, minValidator, requiredValidator } from '../../functions/validators';
import { deleteBudget, fetchBudgets, refreshBudgets, selectBudgetsListState, setSelectedMonth } from '../../state/budgets';
import { AsyncStatus, IBudgetsState } from '../../state/types';
import { useValidatedState } from '../../hooks/validation';
import { useAuthenticatedEffect } from '../../hooks/user-session';

export default function Budgets() {
   const budgetState: IBudgetsState = useSelector(selectBudgetsListState);

   const dispatch = useDispatch<any>();
   const [yearState, setYearState] = useValidatedState<number>(budgetState.searchParameters.year, [
      requiredValidator('Start is required'),
      minValidator(1980, 'Year must be greater than or equal to 1980'),
   ]);
   const [monthState, setMonthState] = useValidatedState<number>(budgetState.searchParameters.month, [
      requiredValidator('Start is required'),
      maxValidator(12, 'Month must be less than or equal to 12'),
      minValidator(1, 'Month must be greater than or equal to 1'),
   ]);

   useAuthenticatedEffect(() => {
      if (!budgetState.searchParameters.refresh) {
         return;
      }

      dispatch(fetchBudgets({ search: { year: budgetState.searchParameters.year, month: budgetState.searchParameters.month } }));
   }, [budgetState]);

   const updateYear: ChangeEventHandler<HTMLInputElement> = (event) => {
      const year: number = Number.parseInt(event.target.value);
      setYearState(year);
      dispatch(setSelectedMonth(year, monthState.value));
   };

   const updateMonth: ChangeEventHandler<HTMLInputElement> = (event) => {
      let month: number = Number.parseInt(event.target.value);

      if (month === 13 && monthState.value === 12) {
         // Loop back to january
         month = 1;
         event.currentTarget.value = '1';
      }

      if (month === 0 && monthState.value === 1) {
         // Loop back to december
         month = 12;
         event.currentTarget.value = '12';
      }

      setMonthState(month);
      dispatch(setSelectedMonth(yearState.value, month));
   };

   const loading = budgetState.list.status === AsyncStatus.loading;

   const refershClicked = () => {
      if (loading) {
         return;
      }

      const yearErrors = setYearState(yearState.value);
      const monthErrors = setMonthState(monthState.value);

      if (yearErrors || monthErrors) {
         return;
      }

      dispatch(refreshBudgets());
   };

   const onDeleteBudgetClicked = (budgetId: number) => {
      dispatch(deleteBudget({ budgetId }));
   };

   const rows = [];

   for (const budget of budgetState.list.data) {
      rows.push(
         <tr key={budget.id}>
            <td>{budget.name}</td>
            <td>{budget.amount}</td>
            <td className={budget.remaining <= 0 ? 'text-danger' : ''}>{budget.remaining}</td>
            <td>{budget.notes}</td>
            <td className="pull-right">
               <BasicBudgetButtons budget={budget} onDeleteClicked={() => onDeleteBudgetClicked(budget.id)} />
            </td>
         </tr>
      );
   }

   return (
      <>
         <h2>Budgets</h2>
         <div className="form-inline">
            <InlineInput
               name="year"
               labelText="Year"
               showErrors={true}
               onChange={updateYear}
               defaultValue={`${yearState.value}`}
               errors={yearState.errors}
               type="number"
            />
            <InlineInput
               name="month"
               labelText="Month"
               showErrors={true}
               onChange={updateMonth}
               defaultValue={`${monthState.value}`}
               errors={monthState.errors}
               type="number"
            />

            <div className="input-group mb-3 pr-2 btn-group">
               <button
                  disabled={loading}
                  type="button"
                  onClick={refershClicked}
                  className="btn btn-primary material-icons"
                  data-toggle="tooltip"
                  data-placement="bottom"
                  title="Refresh budgets"
               >
                  {loading ? <span className="spinner-border spinner-border-sm"></span> : <div className="spin">refresh</div>}
               </button>
               <Link
                  className="btn btn-success material-icons"
                  to="/budgets/add"
                  data-toggle="tooltip"
                  data-placement="bottom"
                  title="Add new budget"
               >
                  add
               </Link>
            </div>
         </div>
         <div className="container-fluid">
            <table className="table">
               <thead>
                  <tr>
                     <th scope="col">Name</th>
                     <th scope="col">Amount</th>
                     <th scope="col">Remaining</th>
                     <th scope="col">Notes</th>
                     <th scope="col"></th>
                  </tr>
               </thead>
               <tbody>{rows}</tbody>
            </table>
         </div>
      </>
   );
}
