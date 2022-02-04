export interface NewAllDeviceReportStatsV1Response {
  status: boolean;
  message: string;
  data: AllDeviceReport[];
}
export interface AllDeviceReport {
  Todaylistimage: string;
  MonthDatelistimage: string;
  SelectDatelistimage: string;
  this_week_travelled_time: string;
  today_travelled_time: string;
  this_weekVehiclelist_string: string;
  todayvehiclelist_string: string;
  device_link_id: string;
  device_id: string;
  vehicle_number: string;
  vehicle_type: string;
  today: DetailEntityToday;
  last_7: ThisWeekOrThisMonth;
  this_week: ThisWeekOrThisMonth;
  this_month: ThisWeekOrThisMonth;
}
export interface DetailEntityToday {
  report_day: any;
  day: string;
  max_speed: string;
  avg_speed: string;
  total_travelled_time: string;
  total_distance: string;
  report_date: string;
  vehicle_number: string;
  free_wheeling_distance:String;
}
export interface ThisWeekOrThisMonth {
  detail?: DetailEntityToday[];
  max_speed: string;
  avg_speed: string;
  total_travelled_time: string;
  total_distance: string;
}


