import { Component, Input } from '@angular/core';
import { IncomeViewModel } from '../../classes';
import { IncomeService } from 'src/app/shared/services';

@Component({
   selector: 'mymoney-income-selector',
   templateUrl: './income-selector.component.html',
})
export class IncomeSelectorComponent {
   @Input()
   public selectedIncomes!: Set<number>;

   public incomes: IncomeViewModel[] | null = null;

   constructor(private readonly incomeService: IncomeService) { }

   public onIncomeCheckboxChange(event: any, id: number): void {
      if (event.target.checked) {
         this.selectedIncomes.add(id);
      } else {
         this.selectedIncomes.delete(id);
      }
   }

   public updateIncomes(date: Date): void {
      this.incomeService.getIncomesByDate(date).subscribe(response => {
         this.incomes = response.incomes.map(t => new IncomeViewModel(t));
      });
   }
}
