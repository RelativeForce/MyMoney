import { browser, by, element } from 'protractor';

export class AppPage {
   navigateTo() {
      return browser.get('/');
   }

   getMainHeading() {
      return element(by.css('mymoney-root h1')).getText();
   }
}
