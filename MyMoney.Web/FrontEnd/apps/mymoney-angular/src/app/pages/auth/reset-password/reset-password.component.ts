import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../../../shared/services';
import { IBasicResultDto } from '@mymoney/common';

@Component({
   templateUrl: 'reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
   public resetPasswordForm: FormGroup;
   public resetPasswordFormControls = {
      password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(15)]),
      confirmPassword: new FormControl('')
   };
   public loading = false;
   public submitted = false;
   public error: string | null = null;
   private token = '';

   constructor(
      private readonly activatedRoute: ActivatedRoute,
      private readonly router: Router,
      private readonly authenticationService: AuthenticationService,
   ) {
      this.resetPasswordForm = new FormGroup(this.resetPasswordFormControls);
   }

   public ngOnInit(): void {

      this.activatedRoute.params.subscribe(params => {
         const token = params['token'];

         if (!token) {
            this.router.navigate(['/auth/login']);
         }

         this.token = token;
      });

      this.resetPasswordForm.valueChanges.subscribe(() => {
         this.checkPasswords();
      });
   }

   public onSubmit(): void {
      this.submitted = true;

      if (this.resetPasswordForm.invalid) {
         return;
      }

      this.loading = true;
      this.error = null;

      const password: string = this.resetPasswordFormControls.password.value ?? '';

      this.authenticationService.resetPassword(password, this.token)
         .pipe(first())
         .subscribe(
            (result: IBasicResultDto) => {
               this.loading = false;

               if (result.success) {
                  this.router.navigate(['/auth/login']);
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
      const isInvalid = this.resetPasswordFormControls.password.value !== this.resetPasswordFormControls.confirmPassword.value;

      if (isInvalid) {
         this.resetPasswordFormControls.confirmPassword.setErrors({ notSame: true });
      } else {
         this.resetPasswordFormControls.confirmPassword.setErrors(null);
      }
   }
}
