import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CurrentUserService } from '../../shared/services';
import { toInputDateString } from '../../shared/functions';
import { filter } from 'rxjs/operators';
import { IUser } from 'src/app/shared/state/types';
import { IBasicResultDto, IUserDto } from 'src/app/shared/api';
import { IAppState } from 'src/app/shared/state/app-state';
import { Store } from '@ngrx/store';
import { SetUserAction } from 'src/app/shared/state/actions';

@Component({
   templateUrl: 'user.component.html'
})
export class UserComponent implements OnInit {
   public userForm: FormGroup;
   public loading = false;
   public submitted = false;
   public error: string | null = null;

   constructor(
      private readonly formBuilder: FormBuilder,
      private readonly currentUserService: CurrentUserService,
      private readonly store: Store<IAppState>,
   ) {
   }

   public ngOnInit(): void {
      this.userForm = this.formBuilder.group({
         email: ['', [Validators.required]],
         fullName: ['', [Validators.required]],
         dateOfBirth: [new Date().toISOString().split('T')[0], [Validators.required]],
      });

      this.disableForm();

      this.currentUserService.currentUser()
         .pipe(filter((currentUser: IUser | null) => currentUser !== null))
         .subscribe((currentUser: IUser) => {
            this.f.dateOfBirth.patchValue(toInputDateString(currentUser.dateOfBirth));
            this.f.fullName.patchValue(currentUser.fullName);
            this.f.email.patchValue(currentUser.email);

            this.enableForm();
         });
   }

   public get f() {
      return this.userForm.controls;
   }

   public onSubmit(): void {
      this.submitted = true;

      if (this.userForm.invalid) {
         return;
      }

      this.loading = true;
      this.error = null;

      const email: string = this.f.email.value;
      const fullName: string = this.f.fullName.value;
      const dateOfBirth: string = this.f.dateOfBirth.value;

      const newData: IUserDto = {
         email,
         fullName,
         dateOfBirth
      };

      this.currentUserService.updateCurrentUser(newData)
         .subscribe(
            (result: IBasicResultDto) => {

               this.loading = false;

               if (result.success) {

                  // Fix date to match what is expected from the server
                  newData.dateOfBirth = new Date(dateOfBirth).toLocaleDateString('en-GB');

                  this.store.dispatch(new SetUserAction(newData));
               } else {
                  this.error = result.error;
               }
            },
            error => {
               this.error = 'Unknown error';
               this.loading = false;
            });
   }

   private disableForm() {
      this.f.email.disable();
      this.f.fullName.disable();
      this.f.dateOfBirth.disable();
   }

   private enableForm() {
      this.f.email.enable();
      this.f.fullName.enable();
      this.f.dateOfBirth.enable();
   }
}
