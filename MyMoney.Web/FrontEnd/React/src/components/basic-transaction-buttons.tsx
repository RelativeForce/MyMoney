import { ITransactionDto } from "mymoney-common/lib/api/dtos";
import Link from "next/link";

export default function BasicTransactionButtons({ transaction, onDeleteClicked }: { transaction: ITransactionDto, onDeleteClicked: () => void }) {
    return (
        <div className="btn-group">
            <Link
                className="btn btn-primary material-icons"
                href={`/transactions/edit?id=${transaction.id}`}
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