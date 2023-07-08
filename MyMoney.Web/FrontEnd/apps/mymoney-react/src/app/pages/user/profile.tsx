import { ChangeEventHandler, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IUserDto } from '@mymoney-common/api';
import { selectCurrentUserState, updateUser } from '../../state/session-slice';
import Input from '../../components/input';
import { requiredValidator } from '../../functions/validators';
import { AsyncStatus, IAsyncState } from '../../state/types';
import { toInputDateString } from '@mymoney-common/functions';
import { Link } from 'react-router-dom';
import { useValidatedState } from '../../hooks/validation';

export default function Profile() {
   const userState: IAsyncState<IUserDto | null> = useSelector(
      selectCurrentUserState
   );

   const [submitted, setSubmitted] = useState<boolean>(false);
   const [loading, setLoading] = useState<boolean>(false);
   const [error, setError] = useState<string | null>(null);
   const [emailState, setEmailState] = useValidatedState<string>('', [
      requiredValidator('Email is required'),
   ]);
   const [fullNameState, setFullNameState] = useValidatedState<string>('', [
      requiredValidator('Full name is required'),
   ]);
   const [dateOfBirthState, setDateOfBirthState] = useValidatedState<string>(
      '',
      [requiredValidator('Date of birth is required')]
   );
   const dispatch = useDispatch<any>();

   useEffect(() => {
      if (userState.status === AsyncStatus.loading || userState.data == null) {
         return;
      }

      setEmailState(userState.data.email);
      setFullNameState(userState.data.fullName);
      setDateOfBirthState(toInputDateString(userState.data.dateOfBirth));
   }, [dispatch, userState.status]);

   const updateEmail: ChangeEventHandler<HTMLInputElement> = (event) => {
      setEmailState(event.target.value);
   };

   const updateFullName: ChangeEventHandler<HTMLInputElement> = (event) => {
      setFullNameState(event.target.value);
   };

   const updateDateOfBirth: ChangeEventHandler<HTMLInputElement> = (event) => {
      setDateOfBirthState(event.target.value);
   };

   const loginClicked = () => {
      setSubmitted(true);

      if (loading) {
         return;
      }

      const emailErrors = setEmailState(emailState.value);
      const fullNameErrors = setFullNameState(fullNameState.value);
      const dateOfBirthErrors = setDateOfBirthState(dateOfBirthState.value);

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
