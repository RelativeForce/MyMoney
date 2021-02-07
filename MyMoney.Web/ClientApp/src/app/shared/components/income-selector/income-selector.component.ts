import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { IncomeViewModel } from '../../classes';
import { IncomeService } from 'src/app/shared/services';
import { IIncomeDto } from '../../api';

@Component({
   selector: 'mymoney-income-selector',
   templateUrl: './income-selector.component.html',
})
export class IncomeSelectorComponent implements OnChanges {
   @Input()
   public selectedIncomes: Set<number> = new Set<number>();

   @Input()
   public date: Date | null = null;

   public incomes: IncomeViewModel[] | null = null;

   public realisingChild: number | null = null;

   constructor(private readonly incomeService: IncomeService) { }

   public onIncomeCheckboxChange(event: any, income: IncomeViewModel): void {
      if (income.id < 0) {

         this.realisingChild = income.id;
         this.incomeService
            .realiseIncome(income.parentId, income.date, income.id)
            .subscribe((realChild: IIncomeDto) => {
               this.realisingChild = null;
               this.selectedIncomes.add(realChild.id);
            });
         return;
      }

      if (event.target.checked) {
         this.selectedIncomes.add(income.id);
      } else {
         this.selectedIncomes.delete(income.id);
      }
   }

   public ngOnChanges(changes: SimpleChanges): void {
      if (changes.date) {
         const oldDate: Date | null | undefined = changes.date.previousValue;
         const newDate: Date | null = changes.date.currentValue;

         if (newDate === null) {
            return;
         }

         const valueHasChanged = this.date?.getTime() !== oldDate?.getTime();
         const isFirstChange = oldDate === undefined || oldDate === null;

         if (valueHasChanged || isFirstChange) {

            if (!isFirstChange) {
               this.selectedIncomes.clear();
            }

            this.updateIncomes(newDate);
         }
      }
   }

   public updateIncomes(date: Date): void {
      this.incomes = null;
      this.incomeService.getIncomesByDate(date).subscribe(response => {
         this.incomes = response.incomes.map(t => new IncomeViewModel(t));
      });
   }
}
