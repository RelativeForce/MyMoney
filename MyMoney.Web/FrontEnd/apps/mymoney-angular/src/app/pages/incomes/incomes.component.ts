import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IncomeService } from '../../shared/services';
import { IncomeViewModel } from '@mymoney-common/classes';
import { Store } from '@ngrx/store';
import { IAppState } from '../../shared/state/app-state';
import { selectIncomes, selectIncomesSearchParameters } from '../../shared/state/selectors/income.selector';
import { IDateRangeModel } from '../../shared/state/types';
import { toDateString } from '@mymoney-common/functions';

@Component({
   selector: 'mymoney-incomes',
   templateUrl: './incomes.component.html',
   styleUrls: ['./incomes.component.scss']
})
export class IncomesComponent implements OnInit {

   public incomes: IncomeViewModel[] = [];
   public dateRange: IDateRangeModel = { start: new Date(), end: new Date() };
   public dateForm: FormGroup;
   public dateRangeFormControls = {
      start: new FormControl(toDateString(this.dateRange.start), [Validators.required]),
      end: new FormControl(toDateString(this.dateRange.end), [Validators.required])
   }
   public loading = false;
   public submitted = false;

   constructor(
      private readonly incomeService: IncomeService,
      private readonly store: Store<IAppState>
   ) {
      this.dateForm = new FormGroup(this.dateRangeFormControls);
   }

   public ngOnInit(): void {
      this.store
         .select(selectIncomes)
         .subscribe((incomes) => {
            this.incomes = incomes.map(t => new IncomeViewModel(t));
            this.loading = false;
         });

      this.store
         .select(selectIncomesSearchParameters)
         .subscribe((searchParameters) => {
            this.dateRange = searchParameters.dateRange;

            this.dateRangeFormControls.start.setValue(toDateString(searchParameters.dateRange.start));
            this.dateRangeFormControls.end.setValue(toDateString(searchParameters.dateRange.end));
         });

      this.incomeService.refreshIncomes();
   }

   public get start(): string {
      return this.formatDate(this.dateRange.start);
   }

   public get end(): string {
      return this.formatDate(this.dateRange.end);
   }

   public updateIncomes(): void {
      this.submitted = true;

      if (this.dateForm.invalid) {
         return;
      }

      this.loading = true;

      this.dateRange = { 
         start: new Date(this.dateRangeFormControls.start.value ?? ''),
         end: new Date(this.dateRangeFormControls.end.value ?? ''),
       };

      this.incomeService.updateDate(this.dateRange);
   }

   public deleteRecurringIncome(id: number): void {
      if (!confirm(`Delete recurring income ${id}?`)) {
         return;
      }

      this.incomeService.deleteRecurringIncome(id);
   }

   public deleteIncome(id: number): void {
      if (!confirm(`Delete income ${id}?`)) {
         return;
      }

      this.incomeService.deleteIncome(id);
   }

   private formatDate(date: Date): string {

      const parsedDate = new Date(date);

      const month = parsedDate.getMonth() + 1;

      const day = parsedDate.getDate();

      const monthStr = month < 10 ? '0' + month : month;

      const dayStr = day < 10 ? '0' + day : day;

      return parsedDate.getFullYear() + '-' + monthStr + '-' + dayStr;
   }
}
