import { Frequency } from './api';
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
