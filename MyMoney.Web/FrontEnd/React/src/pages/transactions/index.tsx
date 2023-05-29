import Link from "next/link";
import { ChangeEventHandler, useEffect, useState } from "react"
import { useDispatch } from 'react-redux';
import { ISessionModel } from 'mymoney-common/lib/interfaces';
import { selectCurrentSession } from "@/state/session-slice";
import { useSelector } from 'react-redux';
import InlineInput from "@/components/inline-input";
import BasicTransactionButtons from "@/components/basic-transaction-buttons";
import { FormControlState } from "@/interfaces/form-conrtol-props";
import { requiredValidator } from "@/functions/validators";
import { IFetchTransactionsRequest, fetchTransactions, refreshTransactions, selectTransactionState, setDataRange } from "@/state/transactions-slice";
import { AsyncStatus, ITransactionState } from "@/state/types";
import RecurringTransactionButtons from "@/components/recurring-transaction-buttons copy";
import { useUserSession } from "@/hooks/user-session";

export default function Transactions() {
   const tranactionState: ITransactionState = useSelector(selectTransactionState);
   const dispatch = useDispatch<any>();
   const [startState, setStartState] = useState<FormControlState>({ value: '', errors: null });
   const [endState, setEndState] = useState<FormControlState>({ value: '', errors: null });

   useEffect(() => {
      setStartState({ value: tranactionState.searchParameters.dateRange.start, errors: null });
      setEndState({ value: tranactionState.searchParameters.dateRange.end, errors: null });
   }, [dispatch]);

   const loading = tranactionState.transactions.status === AsyncStatus.loading;

   useUserSession((sessionToken: string) => {
      if (loading || (!loading && !tranactionState.searchParameters.refresh)) {
         return;
      }

      const request: IFetchTransactionsRequest = {
         sessionToken,
         dateRange: tranactionState.searchParameters.dateRange
      }

      dispatch(fetchTransactions(request));
   }, [dispatch, tranactionState]);

   const updateStart: ChangeEventHandler<HTMLInputElement> = (event) => {
      const start: string = event.target.value;

      const errors = requiredValidator(start, 'Start is required');
      setStartState({ value: start, errors });

      dispatch(setDataRange(start, endState.value));
   }

   const updateEnd: ChangeEventHandler<HTMLInputElement> = (event) => {
      const end: string = event.target.value;

      const errors = requiredValidator(end, 'End is required');
      setEndState({ value: end, errors });

      dispatch(setDataRange(startState.value, end));
   }

   const refershClicked = () => {
      if (loading) {
         return;
      }

      const startErrors = requiredValidator(startState.value, 'Start is required');
      setStartState({ value: startState.value, errors: startErrors });

      const endErrors = requiredValidator(endState.value, 'End is required');
      setEndState({ value: endState.value, errors: endErrors });

      if (startErrors || endErrors) {
         return;
      }

      dispatch(refreshTransactions());
   }

   const deleteTransaction = (transactionId: number) => {
      // TODO: Delete transaction
   }

   const deleteRecurringTransaction = (recurringTransactionId: number) => {
      // TODO: Delete recurring
   }

   const rows = [];

   for (const transaction of tranactionState.transactions.data) {
      rows.push((
         <tr key={transaction.id}>
            <td>{transaction.date}</td>
            <td>{transaction.description}</td>
            <td>{transaction.amount}</td>
            <td className="pull-right">
               {transaction.parentId ?
                  (
                     <RecurringTransactionButtons transaction={transaction} onDeleteClicked={() => deleteRecurringTransaction(transaction.parentId ?? 0)} />
                  ) : (
                     <BasicTransactionButtons transaction={transaction} onDeleteClicked={() => deleteTransaction(transaction.id)} />
                  )
               }
            </td>
         </tr>
      ));
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
               <button disabled={loading} type="button" onClick={refershClicked} className="btn btn-primary material-icons" data-toggle="tooltip" data-placement="bottom"
                  title="Refresh transactions" >
                  {loading ? (<span className="spinner-border spinner-border-sm"></span>) : (<div className="spin">refresh</div>)}
               </button>
               <Link className="btn btn-success material-icons" href="/transactions/add" data-toggle="tooltip" data-placement="bottom"
                  title="Add new transaction">add</Link>
               <Link className="btn btn-success material-icons" href="/transactions/import" data-toggle="tooltip" data-placement="bottom"
                  title="Add new transaction">upload</Link>
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
               <tbody>
                  {rows}
               </tbody >
            </table >
         </div >
      </>
   );
}