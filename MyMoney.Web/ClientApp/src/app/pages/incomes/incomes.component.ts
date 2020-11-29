import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IncomeService } from '../../shared/services';
import { IncomeViewModel } from '../../shared/classes';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/shared/state/app-state';
import { selectIncomes, selectIncomesSearchParameters } from 'src/app/shared/state/selectors/income.selector';
import { IDateRangeModel } from '../../shared/state/types';

@Component({
   templateUrl: './incomes.component.html'
})
export class IncomesComponent implements OnInit {

   public incomes: IncomeViewModel[] = [];
   public date: Date;
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
            this.date = searchParameters.date;

            this.dateForm = this.formBuilder.group({
               date: [this.dateString, Validators.required],
            });
         });

      this.incomeService.refreshIncomes();
   }

   private formatDate(date: Date): string {

      const parsedDate = new Date(date);

      const month = parsedDate.getMonth() + 1;

      const day = parsedDate.getDate();

      const monthStr = month < 10 ? '0' + month : month;

      const dayStr = day < 10 ? '0' + day : day;

      return parsedDate.getFullYear() + '-' + monthStr + '-' + dayStr;
   }

   public updateIncomes(): void {

      this.loading = true;

      this.date = this.f.date.value;

      this.incomeService.updateDate(this.date);
   }

   public get dateString(): string {
      return this.formatDate(this.date);
   }

   public get f() { return this.dateForm.controls; }

   public deleteIncome(id: number): void {
      this.incomeService.deleteIncome(id);
   }

   public onSubmit(): void {
      this.submitted = true;

      if (this.dateForm.invalid) {
         return;
      }

      this.updateIncomes();
   }
}
