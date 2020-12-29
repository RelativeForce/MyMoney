import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../../../shared/services';
import { IBasicResultDto, ILoginResultDto, IRegisterDto } from '../../../shared/api';

@Component({
   templateUrl: 'reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
   public resetPasswordForm: FormGroup;
   public loading = false;
   public submitted = false;
   public error: string | null = null;
   private token: string = null;

   constructor(
      private readonly formBuilder: FormBuilder,
      private readonly activatedRoute: ActivatedRoute,
      private readonly router: Router,
      private readonly authenticationService: AuthenticationService,
   ) {
   }

   public ngOnInit(): void {

      this.activatedRoute.params.subscribe(params => {
         const token = params['token'];

         console.log(token);

         if (!token) {
            this.router.navigate(['/auth/login']);
         }

         this.token = token;
      });


      this.resetPasswordForm = this.formBuilder.group({
         password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(15)]],
         confirmPassword: ['']
      });

      this.resetPasswordForm.valueChanges.subscribe(() => {
         this.checkPasswords();
      });
   }

   public get f() {
      return this.resetPasswordForm.controls;
   }

   public onSubmit(): void {
      this.submitted = true;

      console.log(this.resetPasswordForm);
      if (this.resetPasswordForm.invalid) {
         return;
      }

      this.loading = true;
      this.error = null;

      const password: string = this.f.password.value;

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
            error => {
               this.error = 'Unknown error';
               this.loading = false;
            });
   }

   private checkPasswords() {
      const isInvalid = this.f.password.value !== this.f.confirmPassword.value;

      if (isInvalid) {
         this.f.confirmPassword.setErrors({ notSame: true });
      } else {
         this.f.confirmPassword.setErrors(null);
      }
   }
}
