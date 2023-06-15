import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IRecurringEntityChildDto } from '@mymoney-common/api';
import { toInputDateString } from '@mymoney-common/functions';

@Component({
   selector: 'mymoney-recurring-child-list',
   templateUrl: './recurring-child-list.component.html',
   styleUrls: ['./recurring-child-list.component.scss'],
})
export class RecurringChildListComponent {
   @Input()
   public realisingChildId: number | null = null;

   @Input()
   public isValid = true;

   @Input()
   public children: IRecurringEntityChildDto[] = [];

   @Output()
   public openChild: EventEmitter<IRecurringEntityChildDto> =
      new EventEmitter<IRecurringEntityChildDto>();

   public get nextChildId(): number | null {
      const now = new Date(Date.now()).getTime();

      return (
         this.children.find((d) => Date.parse(toInputDateString(d.date)) > now)
            ?.id ?? null
      );
   }

   public onOpenChildClick(child: IRecurringEntityChildDto) {
      this.openChild.emit(child);
   }
}
