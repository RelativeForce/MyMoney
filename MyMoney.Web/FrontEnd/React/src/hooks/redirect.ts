import { useRouter, NextRouter } from 'next/router';
import { DependencyList, useEffect } from 'react';

export function useRedirect(path: string, condition?: boolean, deps?: DependencyList) {
    const router = useRouter();
    redirect(router, path, condition, deps);
}

export function redirect(router: NextRouter, path: string, condition?: boolean, deps?: DependencyList) {
    useEffect(() => { 
        if (condition === undefined || condition) {
            return void router.push(path);
        }
    }, deps ?? []);
}