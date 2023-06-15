import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IncomeViewModel } from '@mymoney-common/classes';
import { IIncomeDto } from '@mymoney-common/api';
import { IncomeService } from '../../services';

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

  public onIncomeCheckboxChange(newValue: boolean, income: IncomeViewModel): void {
    if (income.id < 0 && income.parentId && this.incomes) {
      const incomes = this.incomes;
         this.realisingChild = income.id;

         this.incomeService
            .realiseIncome(income.parentId, income.date, income.id)
            .subscribe((realChild: IIncomeDto) => {
               this.realisingChild = null;

               // Updated model
               const model = incomes.find(i => i.id === income.id);
               model!.id = realChild.id;
               income.id = realChild.id;

               this.selectedIncomes.add(realChild.id);
            });
         return;
      }

      if (newValue) {
         this.selectedIncomes.add(income.id);
      } else {
         this.selectedIncomes.delete(income.id);
      }
   }

   public ngOnChanges(changes: SimpleChanges): void {
      if (changes['date']) {
         const oldDate: Date | null | undefined = changes['date'].previousValue;
         const newDate: Date | null = changes['date'].currentValue;

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
         this.incomes = response.incomes.map((t: IIncomeDto) => new IncomeViewModel(t));
      });
   }
}
