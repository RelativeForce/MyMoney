import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../../../shared/services';
import { ILoginResultDto, IRegisterDto } from '../../../shared/api';

@Component({
   templateUrl: 'register.component.html'
})
export class RegisterComponent implements OnInit {
   public registerForm: FormGroup;
   public loading = false;
   public submitted = false;
   public error: string | null = null;

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
         dateOfBirth: [new Date().toISOString().split('T')[0], Validators.required],
         password: ['', [Validators.required, Validators.minLength(8)]]
      });
   }

   public get f() {
      return this.registerForm.controls;
   }

   public onSubmit(): void {
      this.submitted = true;

      if (this.registerForm.invalid) {
         return;
      }

      this.loading = true;
      this.error = null;

      const user: IRegisterDto = this.registerForm.value;

      this.authenticationService.register(user)
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
               this.error = 'Unknown error';
               this.loading = false;
            });
   }
}
