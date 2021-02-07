import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IRecurringEntityChildDto } from 'src/app/shared/api';
import { toInputDateString } from 'src/app/shared/functions';

@Component({
   selector: 'mymoney-recurring-child-list',
   templateUrl: './recurring-child-list.component.html',
   styleUrls: ['./recurring-child-list.component.scss']
})
export class RecurringChildListComponent {

   @Input()
   public realisingChild: number | null = null;

   @Input()
   public isValid = true;

   @Input()
   public children: IRecurringEntityChildDto[] = [];

   @Output()
   public openChild: EventEmitter<IRecurringEntityChildDto> = new EventEmitter<IRecurringEntityChildDto>();

   public get nextChildIncome(): number | null {

      const now = new Date(Date.now()).getTime();

      return this.children.find(d => Date.parse(toInputDateString(d.date)) > now)?.id ?? null;
   }

   public onOpenChildClick(child: IRecurringEntityChildDto) {
      this.openChild.emit(child);
   }
}
