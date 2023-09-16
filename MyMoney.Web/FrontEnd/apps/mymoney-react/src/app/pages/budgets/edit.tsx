import { useSearchParams } from "react-router-dom";

export default function EditBudget() {
   const [searchParams, setSearchParams] = useSearchParams();

   console.log(searchParams.get('id'));


   return <>Edit Budget</>;
}
