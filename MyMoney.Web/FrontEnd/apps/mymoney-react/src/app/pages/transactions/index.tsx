import { Link } from 'react-router-dom';
import { ChangeEventHandler } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import InlineInput from '../../components/inline-input';
import BasicTransactionButtons from '../../components/basic-transaction-buttons';
import { requiredValidator } from '../../functions/validators';
import {
   deleteRecurringTransaction,
   deleteTransaction,
   fetchTransactions,
   refreshTransactions,
   selectTransactionsListState,
   setDataRange,
} from '../../state/transactions';
import { AsyncStatus, ITransactionsState } from '../../state/types';
import RecurringTransactionButtons from '../../components/recurring-transaction-buttons';
import { useValidatedState } from '../../hooks/validation';
import { useAuthenticatedEffect } from '../../hooks/user-session';

export default function Transactions() {
   const tranactionState: ITransactionsState = useSelector(selectTransactionsListState);

   const dateRange = tranactionState.searchParameters.dateRange;
   const [startState, setStartState] = useValidatedState<string>(dateRange.start, [requiredValidator('Start is required')]);
   const [endState, setEndState] = useValidatedState<string>(dateRange.end, [requiredValidator('End is required')]);

   const dispatch = useDispatch<any>();
   useAuthenticatedEffect(() => {
      if (!tranactionState.searchParameters.refresh) {
         return;
      }

      dispatch(fetchTransactions({ dateRange: tranactionState.searchParameters.dateRange }));
   }, [tranactionState]);

   const updateStart: ChangeEventHandler<HTMLInputElement> = (event) => {
      const start: string = event.target.value;
      setStartState(start);
      dispatch(setDataRange(start, endState.value));
   };

   const updateEnd: ChangeEventHandler<HTMLInputElement> = (event) => {
      const end: string = event.target.value;
      setEndState(end);
      dispatch(setDataRange(startState.value, end));
   };

   const loading = tranactionState.list.status === AsyncStatus.loading;

   const refershClicked = () => {
      if (loading) {
         return;
      }

      const startErrors = setStartState(startState.value);
      const endErrors = setEndState(endState.value);

      if (startErrors || endErrors) {
         return;
      }

      dispatch(refreshTransactions());
   };

   const onDeleteTransactionClicked = (transactionId: number) => {
      dispatch(deleteTransaction({ transactionId }));
   };

   const onDeleteRecurringTransactionClicked = (recurringTransactionId: number | null) => {
      if (!recurringTransactionId) {
         return;
      }

      dispatch(deleteRecurringTransaction({ recurringTransactionId }));
   };

   const rows = [];

   for (const transaction of tranactionState.list.data) {
      rows.push(
         <tr key={transaction.id}>
            <td>{transaction.date}</td>
            <td>{transaction.description}</td>
            <td>{transaction.amount}</td>
            <td className="pull-right">
               {transaction.parentId ? (
                  <RecurringTransactionButtons
                     transaction={transaction}
                     onDeleteClicked={() => onDeleteRecurringTransactionClicked(transaction.parentId)}
                  />
               ) : (
                  <BasicTransactionButtons transaction={transaction} onDeleteClicked={() => onDeleteTransactionClicked(transaction.id)} />
               )}
            </td>
         </tr>
      );
   }

   return (
      <>
         <h2>Transactions</h2>
         <div className="form-inline">
            <InlineInput
               name="start"
               labelText="Start"
               showErrors={true}
               onChange={updateStart}
               defaultValue={startState.value}
               errors={startState.errors}
               type="date"
            />
            <InlineInput
               name="end"
               labelText="End"
               showErrors={true}
               onChange={updateEnd}
               defaultValue={endState.value}
               errors={endState.errors}
               type="date"
            />

            <div className="input-group mb-3 pr-2 btn-group">
               <button
                  disabled={loading}
                  type="button"
                  onClick={refershClicked}
                  className="btn btn-primary material-icons"
                  data-toggle="tooltip"
                  data-placement="bottom"
                  title="Refresh transactions"
               >
                  {loading ? <span className="spinner-border spinner-border-sm"></span> : <div className="spin">refresh</div>}
               </button>
               <Link
                  className="btn btn-success material-icons"
                  to="/transactions/add"
                  data-toggle="tooltip"
                  data-placement="bottom"
                  title="Add new transaction"
               >
                  add
               </Link>
               <Link
                  className="btn btn-success material-icons"
                  to="/transactions/import"
                  data-toggle="tooltip"
                  data-placement="bottom"
                  title="Add new transaction"
               >
                  upload
               </Link>
            </div>
         </div>
         <div className="container-fluid">
            <table className="table">
               <thead>
                  <tr>
                     <th scope="col">Date</th>
                     <th scope="col">Description</th>
                     <th scope="col">Amount</th>
                     <th scope="col"></th>
                  </tr>
               </thead>
               <tbody>{rows}</tbody>
            </table>
         </div>
      </>
   );
}
