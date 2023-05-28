import { redirect } from '@/hooks/redirect';

export default function Auth() {
  redirect('/auth/login');
  return (<></>);
}