import { ITransactionDto } from "@mymoney/common/api/dtos";
import { Link } from "react-router-dom";

export default function BasicTransactionButtons({ transaction, onDeleteClicked }: { transaction: ITransactionDto, onDeleteClicked: () => void }) {
    return (
        <div className="btn-group">
            <Link
                className="btn btn-primary material-icons"
                to={`/transactions/edit?id=${transaction.id}`}
                data-toggle="tooltip"
                data-placement="bottom"
                title={`Edit transaction ${transaction.id}`}
            >
                edit
            </Link>
            <button
                className="btn btn-danger material-icons"
                onClick={onDeleteClicked}
                data-toggle="tooltip"
                data-placement="bottom"
                title={`Delete transaction ${transaction.id}`}
            >
                delete
            </button>
        </div >
    );
}