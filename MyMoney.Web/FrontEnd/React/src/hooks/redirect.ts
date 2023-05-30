import { useRouter } from 'next/router';
import { DependencyList, useEffect } from 'react';

export function useRedirect(path: string, condition?: boolean, deps?: DependencyList) {
    const router = useRouter();

    useEffect(() => { 
        if (condition === undefined || condition) {
            return void router.push(path);
        }
    }, deps ?? []);
}