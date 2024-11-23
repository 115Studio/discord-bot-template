export enum Time {
  Second = 1000,
  Minute = 60 * Time.Second,
  Hour = 60 * Time.Minute,
  Day = 24 * Time.Hour,
  Week = 7 * Time.Day,
  Month = 30 * Time.Day,
  Year = 365 * Time.Day,
}

export enum TimeLimits {
  Example = 2 * Time.Month
}
