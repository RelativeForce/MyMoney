import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../../shared/services';
import { IRegisterRequestDto } from '../../shared/api';

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
   ) {
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

      const user: IRegisterRequestDto = this.registerForm.value;

      this.authenticationService.register(user)
         .pipe(first())
         .subscribe(
            success => {

               this.loading = false;

               if (success) {
                  this.router.navigate(['/']);
               }
            },
            error => {
               this.loading = false;
            });
   }
}
