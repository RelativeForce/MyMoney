import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../../shared/services';

@Component({
   templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

   public loginForm: FormGroup;
   public loading = false;
   public submitted = false;

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

   public get f() { return this.loginForm.controls; }

   public onSubmit(): void {
      this.submitted = true;

      // stop here if form is invalid
      if (this.loginForm.invalid) {
         return;
      }

      this.loading = true;

      // Login here
      const email = this.f.email.value;
      const password = this.f.password.value;

      this.authenticationService.login(email, password)
         .pipe(first())
         .subscribe(
            success => {
               this.loading = false;
               if (success) {
                  this.router.navigate(['/']);
               } else {
                  console.log('Failed login');
               }
            },
            error => {
               // Show error
               this.loading = false;
            });
   }
}
