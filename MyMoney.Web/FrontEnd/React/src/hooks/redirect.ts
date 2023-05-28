import { useRouter } from 'next/router';
import { useEffect } from 'react';

export function redirect(path: string) {
    const router = useRouter();
    useEffect(() => void router.push(path), []);
}