import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Row } from './row.class';
import { groupBy } from 'mymoney-common/lib/functions';
import { IImportDataProvider } from './import-data-provider.interface';
import { BaseHeading } from './base-heading.class';

@Component({
  templateUrl: './import-file.component.html',
  selector: 'mymoney-import-file'
})
export class ImportFileComponent<T> {

  @Input()
  public dataProvider!: IImportDataProvider<T>;

  public rows: Row[];
  public headings: BaseHeading<T>[];
  public isLoading: boolean;
  public isDone: boolean;

  constructor(private readonly router: Router) {
    this.rows = [];
    this.headings = [];
    this.isLoading = false;
    this.isDone = false;
  }

  public openFile(event: any) {
    const input = event.target;
    for (let index = 0; index < input.files.length; index++) {
      const reader = new FileReader();
      reader.onload = () => {
        this.rows = [];

        // this 'text' is the content of the file
        const text = reader.result as string;

        const lines: string[] = text.split('\n');

        let id = 0;
        for (const line of lines) {

          const data = line.split(',').map(element => element.trim().replace(/"/g, ''));

          this.rows[this.rows.length] = new Row(data, id++);
        }

        this.resetHeadings();
        this.checkRows();
      };
      reader.readAsText(input.files[index]);
    }
  }

  public resetHeadings(): void {
    this.headings = [];
    this.isLoading = false;
    this.isDone = false;

    let columnCount = 0;
    for (const row of this.rows) {
      columnCount = Math.max(columnCount, row.data.length);
    }

    for (let index = 0; index < columnCount; index++) {
      this.headings[index] = this.dataProvider.newHeading();
    }

    for (const row of this.rows) {
      if (row.data.length === columnCount) {
        continue;
      }
      for (let index = 0; index < columnCount; index++) {

        if (row.data[index] === undefined) {
          row.data[index] = '';
        }
      }
    }
  }

  public deleteRow(rowId: number): void {
    this.rows = this.rows.filter(r => r.id !== rowId);

    this.checkRows();
  }

  public changeElementValue(event: Event, rowId: number, elementIndex: number) {
    const value = (event.target as HTMLInputElement)?.value as string | undefined;

    if (value == undefined) {
      return;
    }

    this.rows.find(r => r.id === rowId)?.setValue(elementIndex, value);

    this.checkRows();
  }

  public onColumnChange(event: Event, elementIndex: number) {
    const value = (event.target as HTMLInputElement)?.value as T | undefined;

    if (value == undefined) {
      return;
    }

    this.headings[elementIndex].property = value;

    this.checkRows();
  }

  public checkRows() {

    if (this.dataProvider.columnErrorMessage(this.headings) !== null) {
      return; // Skip if the columns are not valid
    }
    const duplicateTransactions = groupBy(this.rows, this.dataProvider.setupKeyExtractor(this.headings)).entries();

    for (const [_, rows] of duplicateTransactions) {

      if (rows.length === 1) {
        // Clear the error
        this.dataProvider.markAsUnique(rows);
        continue;
      }

      this.dataProvider.markAsDuplicate(rows);
    }
  }

  public alert(text: string): void {
    alert(text);
  }

  public onSubmit(): void {

    const columnErrorMessage = this.dataProvider.columnErrorMessage(this.headings);

    if (columnErrorMessage !== null) {
      return alert(columnErrorMessage);
    }

    const anyInvalidRows: boolean = this.rows
      .map(r => this.isRowValid(r))
      .reduce((a, b) => a || b, false);

    if (anyInvalidRows) {
      if (!confirm('Warning:\nSome rows have invalid data and will be ignored.\nContinue?')) {
        return;
      }
    }

    this.isLoading = true;

    this.dataProvider.submit(this.rows, this.headings, () => {
      this.isLoading = false;
      this.isDone = true;

      setTimeout(() => {
        if (this.doneConfirmation()) {
          this.router.navigate([this.dataProvider.homeLink]);
        }
      }, 2000);
    });
  }

  private isRowValid(row: Row) {

    const allDataValid = row.data
      .map((d, index) => this.headings[index].format(d) === null)
      .reduce((a, b) => a || b, false);

    return allDataValid;
  }

  private doneConfirmation(): boolean {
    const created = this.rows.filter(r => r.success === true).length;
    const failed = this.rows.filter(r => r.success === false).length;

    return confirm(this.dataProvider.doneMessage(created, failed));
  }
}
