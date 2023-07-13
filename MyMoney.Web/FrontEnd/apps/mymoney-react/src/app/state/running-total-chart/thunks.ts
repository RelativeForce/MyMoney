import { createAsyncThunk } from '@reduxjs/toolkit';
import { HomeApi, IDateRangeDto, IRunningTotalListDto } from '@mymoney-common/api';
import { first, map } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { HttpHelper } from '../../classess/http-helper';
import { SLICE_NAME } from './constants';

function getYearDateRange(year: number): IDateRangeDto {
   const end: Date = new Date();
   end.setDate(1);
   end.setMonth(0);
   end.setFullYear(year + 1);
   end.setHours(0, 0, 0, 0);
   end.setDate(0); // Subtract 1 day

   const start: Date = new Date();
   start.setDate(1);
   start.setFullYear(year);
   start.setMonth(0);
   start.setHours(0, 0, 0, 0);

   return { end, start };
}

export const fetchRunningTotals = createAsyncThunk(`${SLICE_NAME}/fetchRunningTotals`, async (year: number, { getState, rejectWithValue }) => {
   const httpHelper = HttpHelper.forCuurentUser(getState);
   if (!httpHelper) {
      return rejectWithValue('No user session');
   }

   const dateRange = getYearDateRange(year);

   const api = new HomeApi(httpHelper);

   try {
      return await firstValueFrom(
         api.runningTotal({ initialTotal: 0, dateRange }).pipe(
            first(),
            map((listDto: IRunningTotalListDto) => listDto.runningTotals)
         )
      );
   } catch (error: any) {
      return rejectWithValue(error.message);
   }
});
