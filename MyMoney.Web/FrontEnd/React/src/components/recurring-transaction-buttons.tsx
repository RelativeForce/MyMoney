import { ITransactionDto } from "mymoney-common/lib/api/dtos";
import Link from "next/link";

export default function RecurringTransactionButtons({ transaction, onDeleteClicked }: { transaction: ITransactionDto, onDeleteClicked: () => void }) {
    return (
        <div className="btn-group">
            {transaction.id > 0 ? (
                <Link
                    className="btn btn-primary material-icons"
                    href={`/transactions/edit?id=${transaction.id}`}
                    data-toggle="tooltip"
                    data-placement="bottom"
                    title="Edit notes for child transaction"
                >
                    comment
                </Link>
            ) : ''}

            <Link
                className="btn btn-primary material-icons"
                href={`/transactions/edit-recurring?id=${transaction.parentId}`}
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
        </div >
    );
}