import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IncomeService } from '../../shared/services';
import { IncomeViewModel } from '../../shared/classes';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/shared/state/app-state';
import { selectIncomes, selectIncomesSearchParameters } from 'src/app/shared/state/selectors/income.selector';
import { IDateRangeModel } from 'src/app/shared/state/types';

@Component({
   templateUrl: './incomes.component.html',
   styleUrls: ['./incomes.component.scss']
})
export class IncomesComponent implements OnInit {

   public incomes: IncomeViewModel[] = [];
   public dateRange: IDateRangeModel;
   public dateForm: FormGroup;
   public loading: Boolean = false;
   public submitted: Boolean = false;

   constructor(
      private readonly formBuilder: FormBuilder,
      private readonly incomeService: IncomeService,
      private readonly store: Store<IAppState>
   ) { }

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

            this.dateForm = this.formBuilder.group({
               start: [this.start, [Validators.required]],
               end: [this.end, [Validators.required]]
            });
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

      this.dateRange = { start: this.f.start.value, end: this.f.end.value };

      this.incomeService.updateDate(this.dateRange);
   }

   public get f() {
      return this.dateForm.controls;
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
