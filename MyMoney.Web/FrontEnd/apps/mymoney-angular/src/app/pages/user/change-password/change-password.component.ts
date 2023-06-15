import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { CurrentUserService } from '../../../shared/services';
import { IBasicResultDto } from '@mymoney/common/api/dtos';

@Component({
   templateUrl: 'change-password.component.html'
})
export class ChangePasswordComponent implements OnInit {
   public changePasswordForm: FormGroup;
   public changePasswordFormControls = {
      password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(15)]),
      confirmPassword: new FormControl('')
   }
   public loading = false;
   public submitted = false;
   public error: string | null = null;

   constructor(
      private readonly router: Router,
      private readonly currentUserService: CurrentUserService,
   ) {
      this.changePasswordForm = new FormGroup(this.changePasswordFormControls);
   }

   public ngOnInit(): void {
      this.changePasswordForm.valueChanges.subscribe(() => {
         this.checkPasswords();
      });
   }

   public onSubmit(): void {
      this.submitted = true;

      if (this.changePasswordForm.invalid) {
         return;
      }

      this.loading = true;
      this.error = null;

      const password: string = this.changePasswordFormControls.password.value ?? '';

      this.currentUserService.updatePassword(password)
         .pipe(first())
         .subscribe(
            (result: IBasicResultDto) => {
               this.loading = false;

               if (result.success) {
                  this.router.navigate(['/']);
               } else {
                  this.error = result.error;
               }
            },
            () => {
               this.error = 'Unknown error';
               this.loading = false;
            });
   }

   private checkPasswords() {
      const isInvalid = this.changePasswordFormControls.password.value !== this.changePasswordFormControls.confirmPassword.value;

      if (isInvalid) {
         this.changePasswordFormControls.confirmPassword.setErrors({ notSame: true });
      } else {
         this.changePasswordFormControls.confirmPassword.setErrors(null);
      }
   }
}
