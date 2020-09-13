import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../authentication.service';
import { RegisterRequest } from '../models/register.request';
import { LoginResponse } from '../models/login.response';

@Component({
   templateUrl: 'register.component.html'
})
export class RegisterComponent implements OnInit {
   public registerForm: FormGroup;
   public loading = false;
   public submitted = false;

   constructor(
      private readonly formBuilder: FormBuilder,
      private readonly router: Router,
      private readonly authenticationService: AuthenticationService,
      private readonly http: HttpClient
   ) {
      // redirect to home if already logged in
      if (this.authenticationService.isLoggedIn) {
         this.router.navigate(['/']);
      }
   }

   public ngOnInit(): void {
      this.registerForm = this.formBuilder.group({
         email: ['', Validators.required],
         fullName: ['', Validators.required],
         dateOfBirth: [Date.now(), Validators.required],
         password: ['', [Validators.required, Validators.minLength(6)]]
      });
   }


   // convenience getter for easy access to form fields
   public get f() { return this.registerForm.controls; }

   public onSubmit(): void {
      this.submitted = true;

      // stop here if form is invalid
      if (this.registerForm.invalid) {
         return;
      }

      this.loading = true;

      const user: RegisterRequest = this.registerForm.value;

      this.http.post<LoginResponse>(`/User/Register`, user)
         .pipe(first())
         .subscribe(
            response => {
               if (response.success) {

                  this.authenticationService.setUser(user.email, response.token, response.validTo);

                  this.router.navigate(['/']);
               }
            },
            error => {
               this.loading = false;
            });
   }
}
