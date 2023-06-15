import { BaseHeading } from './base-heading.class';
import { Row } from './row.class';

export interface IImportDataProvider<T> {
   fields: T[];
   homeLink: string;
   newHeading(): BaseHeading<T>;
   setupKeyExtractor(headings: BaseHeading<T>[]): (row: Row) => string;
   columnErrorMessage(headings: BaseHeading<T>[]): string | null;
   submit(
      rows: Row[],
      headings: BaseHeading<T>[],
      onComplete: () => void
   ): void;
   markAsDuplicate(rows: Row[]): void;
   markAsUnique(rows: Row[]): void;
   doneMessage(created: number, failed: number): string;
}
