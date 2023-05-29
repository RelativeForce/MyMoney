import { DependencyList, useEffect } from "react"
import { selectCurrentSessionToken } from "@/state/session-slice";
import { useSelector } from 'react-redux';

export function useUserSession(operation: (sessionToken: string) => (void | (() => void)), deps?: DependencyList) {
    const sessionToken: string | null = useSelector(selectCurrentSessionToken);

    useEffect(
        () => {
            if (!sessionToken) {
                return; // Do nothing when no user is logged in
            }

            return operation(sessionToken)
        },
        [sessionToken, ...(deps ?? [])]
    );
}