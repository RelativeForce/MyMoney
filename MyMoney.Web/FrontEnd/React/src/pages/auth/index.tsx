import { useRedirect } from '@/hooks/redirect';

export default function Auth() {
  useRedirect('/auth/login');
  return (<></>);
}