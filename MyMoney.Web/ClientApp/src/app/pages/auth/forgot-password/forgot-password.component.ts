import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../shared/services';

@Component({
   templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent implements OnInit {

   public forgotPasswordForm: FormGroup;
   public loading = false;
   public submitted = false;
   public message: string | null = null;

   constructor(
      private readonly formBuilder: FormBuilder,
      private readonly authenticationService: AuthenticationService,
   ) { }

   public ngOnInit(): void {
      this.forgotPasswordForm = this.formBuilder.group({
         email: ['', [Validators.required]]
      });
   }

   public get f() {
      return this.forgotPasswordForm.controls;
   }

   public onSubmit(): void {
      this.submitted = true;

      if (this.forgotPasswordForm.invalid) {
         return;
      }

      this.loading = true;
      this.message = null;

      const email = this.f.email.value;

      this.authenticationService.forgotPassword(email)
         .subscribe(
            () => {
               this.loading = false;
               this.setMessage();
            },
            () => {
               this.loading = false;
               this.setMessage();
            });
   }

   private setMessage() {
      this.message = 'Email sent (if email is linked to a valid account)';
   }
}
