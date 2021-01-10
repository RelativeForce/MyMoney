import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
   templateUrl: './toggle.component.html',
   styleUrls: ['./toggle.component.scss'],
   selector: 'mymoney-toggle'
})
export class ToggleComponent {

   @Input()
   public value: boolean;

   @Input()
   public text: string;

   @Output()
   public checked: EventEmitter<boolean>;

   constructor() {
      this.value = false;
      this.checked = new EventEmitter<boolean>();
   }

   public onChecked(event: any): void {
      this.checked.emit(event.target.checked);
   }
}
