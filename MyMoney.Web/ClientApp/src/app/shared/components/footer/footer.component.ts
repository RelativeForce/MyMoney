import { Component } from '@angular/core';
import { version } from '../../../../../package.json';

@Component({
   templateUrl: './footer.component.html',
   selector: 'mymoney-footer'
})
export class FooterComponent {

   public versionString: string = version;

   constructor() { }
}
