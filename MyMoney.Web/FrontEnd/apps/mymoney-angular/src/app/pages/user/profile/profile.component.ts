import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CurrentUserService } from '../../../shared/services';
import { toDateString, toInputDateString } from '@mymoney-common/functions';
import { filter, map } from 'rxjs/operators';
import { IUser } from '../../../shared/state/types';
import { IBasicResultDto, IUserDto } from '@mymoney-common/api';
import { IAppState } from '../../../shared/state/app-state';
import { Store } from '@ngrx/store';
import { SetUserAction } from '../../../shared/state/actions';

@Component({
   templateUrl: 'profile.component.html',
})
export class ProfileComponent implements OnInit {
   public profileForm: FormGroup;
   public profileFormControls = {
      email: new FormControl('', [Validators.required]),
      fullName: new FormControl('', [Validators.required]),
      dateOfBirth: new FormControl(toDateString(new Date()), [Validators.required]),
   };
   public loading = false;
   public submitted = false;
   public error: string | null = null;

   constructor(private readonly currentUserService: CurrentUserService, private readonly store: Store<IAppState>) {
      this.profileForm = new FormGroup(this.profileFormControls);
   }

   public ngOnInit(): void {
      this.disableForm();

      this.currentUserService
         .currentUser()
         .pipe(
            filter((currentUser: IUser | null) => currentUser !== null),
            map((currentUser: IUser | null) => currentUser!)
         )
         .subscribe((currentUser: IUser) => {
            this.profileFormControls.dateOfBirth.patchValue(toInputDateString(currentUser.dateOfBirth));
            this.profileFormControls.fullName.patchValue(currentUser.fullName);
            this.profileFormControls.email.patchValue(currentUser.email);

            this.enableForm();
         });
   }

   public onSubmit(): void {
      this.submitted = true;

      if (this.profileForm.invalid) {
         return;
      }

      this.loading = true;
      this.error = null;

      const email: string = this.profileFormControls.email.value ?? '';
      const fullName: string = this.profileFormControls.fullName.value ?? '';
      const dateOfBirth: string = this.profileFormControls.dateOfBirth.value ?? '';

      const newData: IUserDto = {
         email,
         fullName,
         dateOfBirth,
      };

      this.currentUserService.updateCurrentUser(newData).subscribe(
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
         (error) => {
            this.error = 'Unknown error';
            this.loading = false;
         }
      );
   }

   private disableForm() {
      this.profileFormControls.email.disable();
      this.profileFormControls.fullName.disable();
      this.profileFormControls.dateOfBirth.disable();
   }

   private enableForm() {
      this.profileFormControls.email.enable();
      this.profileFormControls.fullName.enable();
      this.profileFormControls.dateOfBirth.enable();
   }
}
