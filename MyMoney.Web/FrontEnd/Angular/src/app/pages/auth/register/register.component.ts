import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../../../shared/services';
import { ILoginResultDto, IRegisterDto } from '../../../shared/api';
import { toDateString } from 'mymoney-common/lib/functions';

@Component({
   templateUrl: 'register.component.html'
})
export class RegisterComponent implements OnInit {
   public registerForm: FormGroup;
   public registerFormControls = {
      email: new FormControl('', [Validators.required]),
      fullName: new FormControl('', [Validators.required]),
      dateOfBirth: new FormControl(toDateString(new Date()), [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(15)]),
      confirmPassword: new FormControl('')
   };
   public loading = false;
   public submitted = false;
   public error: string | null = null;

   constructor(
      private readonly router: Router,
      private readonly authenticationService: AuthenticationService,
   ) {
      this.registerForm = new FormGroup(this.registerFormControls);
   }

   public ngOnInit(): void {
      this.registerForm.valueChanges.subscribe(() => {
         this.checkPasswords();
      });
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
            () => {
               this.error = 'Unknown error';
               this.loading = false;
            });
   }

   private checkPasswords() {
      const isInvalid = this.registerFormControls.password.value !== this.registerFormControls.confirmPassword.value;

      if (isInvalid) {
         this.registerFormControls.confirmPassword.setErrors({ notSame: true });
      } else {
         this.registerFormControls.confirmPassword.setErrors(null);
      }
   }
}
