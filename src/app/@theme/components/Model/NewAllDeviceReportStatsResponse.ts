export interface NewAllDeviceReportStatsResponse {
  status: boolean;
  message: string;
  data: AllDeviceReportStats[];
}
export interface AllDeviceReportStats {
  Todaylistimage: string;
  MonthDatelistimage: string;
  SelectDatelistimage: any;
  this_week_travelled_time: string;
  today_travelled_time: string;
  this_weekVehiclelist_string: string;
  todayvehiclelist_string: string;
  device_link_id: string;
  device_id: string;
  vehicle_number: string;
  vehicle_type: string;
  today: DetailEntityOrToday;
  last_7: ThisWeekOrThisMonth;
  this_week: ThisWeekOrThisMonth;
  this_month: ThisWeekOrThisMonth;

  dashboard_bar_chart_kms: number;

}
export interface DetailEntityOrToday {
  report_day: string;
  day: string;
  max_speed: string;
  max_speed_formatted: any;
  avg_speed: string;
  avg_speed_formatted: any;
  total_travelled_time: string;
  total_travelled_time_formatted: any;
  total_distance: string;
  total_distance_formatted: any;
  report_date: string;
  report_date_formatted: string;
  vehicle_number: string;
  device_link_id: string;
}
export interface ThisWeekOrThisMonth {

  detail?: DetailEntityOrToday[];

  max_speed: string;
  max_speed_formatted: any;
  avg_speed: string;
  avg_speed_formatted: any;
  total_travelled_time: string;
  total_travelled_time_formatted: any;
  total_distance: string;
  total_distance_formatted: any;

}


