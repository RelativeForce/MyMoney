import { Component } from '@angular/core';
import packageInfo from '../../../../../package.json';

@Component({
   templateUrl: './footer.component.html',
   selector: 'mymoney-footer'
})
export class FooterComponent {

   public versionString: string = packageInfo.version;

   constructor() { }
}
