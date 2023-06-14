import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { ILoginResultDto } from '@mymoney/common';

import { AuthenticationService } from '../../../shared/services';

@Component({
   templateUrl: './login.component.html'
})
export class LoginComponent {

   public loginForm: FormGroup;
   public loginFormControls = {
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
   };
   public loading = false;
   public submitted = false;
   public error: string | null = null;

   constructor(
      private readonly authenticationService: AuthenticationService,
      private readonly router: Router
   ) {
      this.loginForm = new FormGroup(this.loginFormControls);
   }

   public onSubmit(): void {
      this.submitted = true;

      if (this.loginForm.invalid) {
         return;
      }

      this.loading = true;
      this.error = null;

      // Login here
      const email = this.loginFormControls.email.value ?? '';
      const password = this.loginFormControls.password.value ?? '';

      this.authenticationService.login(email, password)
         .pipe(first())
         .subscribe(
            (result: ILoginResultDto) => {
               this.loading = false;
               if (result.success) {
                  void this.router.navigate(['/']);
               } else {
                  this.error = result.error;
               }
            },
            error => {
               // Show error
               this.loading = false;
               this.error = 'Unknown error';
            });
   }
}
