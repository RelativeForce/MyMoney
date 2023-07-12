import { IBudgetDto } from '@mymoney-common/api';
import { Link } from 'react-router-dom';

export default function BasicBudgetButtons({ budget, onDeleteClicked }: { budget: IBudgetDto; onDeleteClicked: () => void }) {
   return (
      <div className="btn-group">
         <Link
            className="btn btn-primary material-icons"
            to={`/budgets/edit?id=${budget.id}`}
            data-toggle="tooltip"
            data-placement="bottom"
            title={`Edit budget ${budget.id}`}
         >
            edit
         </Link>
         <button
            className="btn btn-danger material-icons"
            onClick={onDeleteClicked}
            data-toggle="tooltip"
            data-placement="bottom"
            title={`Delete budget ${budget.id}`}
         >
            delete
         </button>
      </div>
   );
}
