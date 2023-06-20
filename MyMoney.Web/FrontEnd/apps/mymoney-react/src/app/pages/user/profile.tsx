import { ChangeEventHandler, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IUserDto } from '@mymoney-common/api';
import { selectCurrentUserState, updateUser } from '../../state/session-slice';
import Input from '../../components/input';
import { FormControlState } from '../../interfaces/form-conrtol-props';
import { requiredValidator } from '../../functions/validators';
import { AsyncStatus, IAsyncState } from '../../state/types';
import { toInputDateString } from '@mymoney-common/functions';
import { Link } from 'react-router-dom';

export default function Profile() {
   const userState: IAsyncState<IUserDto | null> = useSelector(
      selectCurrentUserState
   );

   const [submitted, setSubmitted] = useState<boolean>(false);
   const [loading, setLoading] = useState<boolean>(false);
   const [error, setError] = useState<string | null>(null);
   const [emailState, setEmailState] = useState<FormControlState<string>>({
      value: '',
      errors: null,
   });
   const [fullNameState, setFullNameState] = useState<FormControlState<string>>(
      {
         value: '',
         errors: null,
      }
   );
   const [dateOfBirthState, setDateOfBirthState] = useState<
      FormControlState<string>
   >({
      value: '',
      errors: null,
   });
   const dispatch = useDispatch<any>();

   useEffect(() => {
      if (userState.status === AsyncStatus.loading || userState.data == null) {
         return;
      }

      setEmailState({
         value: userState.data.email,
         errors: null,
      });
      setFullNameState({
         value: userState.data.fullName,
         errors: null,
      });
      setDateOfBirthState({
         value: toInputDateString(userState.data.dateOfBirth),
         errors: null,
      });
   }, [dispatch, userState.status]);

   const updateEmail: ChangeEventHandler<HTMLInputElement> = (event) => {
      const email: string = event.target.value;

      const errors = requiredValidator(email, 'Email is required');
      setEmailState({ value: email, errors });
   };

   const updateFullName: ChangeEventHandler<HTMLInputElement> = (event) => {
      const fullName: string = event.target.value;

      const errors = requiredValidator(fullName, 'Full name is required');
      setFullNameState({ value: fullName, errors });
   };

   const updateDateOfBirth: ChangeEventHandler<HTMLInputElement> = (event) => {
      const dateOfBirth: string = event.target.value;

      const errors = requiredValidator(
         dateOfBirth,
         'Date of birth is required'
      );
      setDateOfBirthState({ value: dateOfBirth, errors });
   };

   const loginClicked = () => {
      setSubmitted(true);

      if (loading) {
         return;
      }

      const emailErrors = requiredValidator(
         emailState.value,
         'Email is required'
      );
      setEmailState({ value: emailState.value, errors: emailErrors });

      const fullNameErrors = requiredValidator(
         fullNameState.value,
         'Full name is required'
      );
      setFullNameState({ value: fullNameState.value, errors: fullNameErrors });

      const dateOfBirthErrors = requiredValidator(
         dateOfBirthState.value,
         'Date of birth is required'
      );
      setDateOfBirthState({
         value: dateOfBirthState.value,
         errors: dateOfBirthErrors,
      });

      if (emailErrors || fullNameErrors || dateOfBirthErrors) {
         return;
      }

      setLoading(true);
      setError(null);

      const user: IUserDto = {
         email: emailState.value,
         fullName: fullNameState.value,
         dateOfBirth: dateOfBirthState.value,
      };

      try {
         dispatch(updateUser(user)).unwrap();
      } catch (error: any) {
         setError(error.message);
      } finally {
         setLoading(false);
      }
   };

   return (
      <>
         <h2>Profile</h2>
         <form>
            <Input
               name="email"
               labelText="Email"
               showErrors={submitted}
               onChange={updateEmail}
               defaultValue={emailState.value}
               errors={emailState.errors}
               type="text"
            />
            <Input
               name="fullName"
               labelText="Full name"
               showErrors={submitted}
               onChange={updateFullName}
               defaultValue={fullNameState.value}
               errors={fullNameState.errors}
               type="text"
            />
            <Input
               name="dateOfBirth"
               labelText="Date Of Birth"
               showErrors={submitted}
               onChange={updateDateOfBirth}
               defaultValue={dateOfBirthState.value}
               errors={dateOfBirthState.errors}
               type="date"
            />
            <div className="form-group">
               <button
                  disabled={loading}
                  type="button"
                  onClick={loginClicked}
                  className="btn btn-primary"
               >
                  {loading ? (
                     <span className="spinner-border spinner-border-sm mr-1"></span>
                  ) : (
                     ''
                  )}
                  Save changes
               </button>
               <Link className="btn btn-link" to="/">
                  Cancel
               </Link>
            </div>
            {error !== null ? (
               <div className="alert alert-danger" role="alert">
                  Save failed: {error}
               </div>
            ) : (
               ''
            )}
         </form>
      </>
   );
}
