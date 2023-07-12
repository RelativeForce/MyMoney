import { useNavigate } from 'react-router-dom';
import { DependencyList, useEffect } from 'react';

export function useRedirect(path: string, condition?: boolean, deps?: DependencyList) {
   const navigate = useNavigate();

   useEffect(() => {
      if (condition === undefined || condition) {
         return void navigate(path);
      }

      return () => {
         /* Do nothing */
      };
   }, deps ?? []);
}
