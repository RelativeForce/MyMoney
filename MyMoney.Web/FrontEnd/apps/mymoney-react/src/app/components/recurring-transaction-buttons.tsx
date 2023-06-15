import { ITransactionDto } from '@mymoney-common/api';
import { Link } from 'react-router-dom';

export default function RecurringTransactionButtons({
   transaction,
   onDeleteClicked,
}: {
   transaction: ITransactionDto;
   onDeleteClicked: () => void;
}) {
   return (
      <div className="btn-group">
         {transaction.id > 0 ? (
            <Link
               className="btn btn-primary material-icons"
               to={`/transactions/edit?id=${transaction.id}`}
               data-toggle="tooltip"
               data-placement="bottom"
               title="Edit notes for child transaction"
            >
               comment
            </Link>
         ) : (
            ''
         )}

         <Link
            className="btn btn-primary material-icons"
            to={`/transactions/edit-recurring?id=${transaction.parentId}`}
            data-toggle="tooltip"
            data-placement="bottom"
            title={`Edit recurring transaction ${transaction.parentId}`}
         >
            edit
         </Link>
         <button
            className="btn btn-danger material-icons"
            onClick={onDeleteClicked}
            data-toggle="tooltip"
            data-placement="bottom"
            title={`Delete recurring transaction ${transaction.parentId}`}
         >
            delete
         </button>
      </div>
   );
}
