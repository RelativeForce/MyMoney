import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
   selector: 'mymoney-check-box',
   templateUrl: './check-box.component.html',
   styleUrls: ['./check-box.component.scss']
})
export class CheckBoxComponent {
   @Input()
   public isChecked = true;

   @Input()
   public disabled = false;

   @Output()
   public change: EventEmitter<boolean> = new EventEmitter<boolean>();

   public onChangeClick(newValue: boolean) {
      this.change.emit(newValue);
   }
}
