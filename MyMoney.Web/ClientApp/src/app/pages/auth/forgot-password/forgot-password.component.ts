import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../shared/services';

@Component({
   templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent implements OnInit {

   public forgotPasswordForm: FormGroup;
   public forgotPasswordFormControls = {
      email: new FormControl('', [Validators.required])
   };
   public loading = false;
   public submitted = false;
   public message: string | null = null;

   constructor(private readonly authenticationService: AuthenticationService) {
      this.forgotPasswordForm = new FormGroup(this.forgotPasswordFormControls);
   }

   public ngOnInit(): void {
   }

   public onSubmit(): void {
      this.submitted = true;

      if (this.forgotPasswordForm.invalid) {
         return;
      }

      this.loading = true;
      this.message = null;

      const email = this.forgotPasswordFormControls.email.value ?? '';

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
