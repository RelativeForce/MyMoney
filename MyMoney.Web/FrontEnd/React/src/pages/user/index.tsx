import { useRedirect } from '@/hooks/redirect';

export default function User() {
  useRedirect('/');
  return (<></>);
}