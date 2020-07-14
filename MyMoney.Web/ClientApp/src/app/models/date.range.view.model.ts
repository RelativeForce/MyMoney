import { DateRangeModel } from "./date.range.model";

export class DateRangeViewModel {
  start: Date;
  end: Date;

  public static toViewModel(model: DateRangeModel): DateRangeViewModel {
    return new DateRangeViewModel(new Date(model.start), new Date(model.end));
  }

  constructor(start: Date, end : Date) {
    this.start = start;
    this.end = end;
  }
}
