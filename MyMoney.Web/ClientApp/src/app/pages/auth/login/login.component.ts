import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { ILoginResultDto } from 'src/app/shared/api';

import { AuthenticationService } from '../../../shared/services';

@Component({
   templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

   public loginForm: FormGroup;
   public loading = false;
   public submitted = false;
   public error: string | null = null;

   constructor(
      private readonly formBuilder: FormBuilder,
      private readonly authenticationService: AuthenticationService,
      private readonly router: Router
   ) { }

   public ngOnInit(): void {
      this.loginForm = this.formBuilder.group({
         email: ['', Validators.required],
         password: ['', Validators.required]
      });
   }

   public get f() {
      return this.loginForm.controls;
   }

   public onSubmit(): void {
      this.submitted = true;

      if (this.loginForm.invalid) {
         return;
      }

      this.loading = true;
      this.error = null;

      // Login here
      const email = this.f.email.value;
      const password = this.f.password.value;

      this.authenticationService.login(email, password)
         .pipe(first())
         .subscribe(
            (result: ILoginResultDto) => {
               this.loading = false;
               if (result.success) {
                  this.router.navigate(['/']);
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
