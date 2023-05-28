import { useSelector } from 'react-redux';
import { selectCurrentSession } from '@/state/sessionSlice';
import { ISessionModel } from 'mymoney-common/lib/interfaces';
import { DependencyList, useEffect } from 'react';

export function useSessionToken(onTokenChange: (token : string | null) => void | (() => void), deps?: DependencyList) {
    const session: ISessionModel | null = useSelector(selectCurrentSession);  
    useEffect(
        () => onTokenChange(session?.token ?? null),
        [session?.token, ...(deps ?? [])],
    );
}