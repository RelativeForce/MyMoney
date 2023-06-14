import { Frequency } from '@mymoney/common';
import { Validators, ValidatorFn } from '@angular/forms';

export const frequencyValidator: ValidatorFn = (frequencyControl) => {
   const minErrors = Validators.min(Frequency.day)(frequencyControl);
   const maxErrors = Validators.max(Frequency.fourWeek)(frequencyControl);

   if (minErrors || maxErrors) {
      return { invalidFrequency: true };
   }

   return null;
};

export const minAmountValidator: ValidatorFn = Validators.min(0.01);

export const monthValidator: ValidatorFn = (monthControl) => {
   const minErrors = Validators.min(1)(monthControl);
   const maxErrors = Validators.max(12)(monthControl);

   if (minErrors || maxErrors) {
      return { invalidMonth: true };
   }

   return null;
};
