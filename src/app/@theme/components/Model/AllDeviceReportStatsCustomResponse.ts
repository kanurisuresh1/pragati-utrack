export interface AllDeviceReportStatsCustomResponse {
  status: boolean;
  message: string;
  data: AllDeviceReportStatsCustom[];
}
export interface AllDeviceReportStatsCustom {
  CustomeDatelistimage: string;
  device_link_id: string;
  device_id: string;
  vehicle_number: string;
  vehicle_type: string;
  detail?: DetailEntity[];
  max_speed: string;
  avg_speed: string;
  total_distance: string;
  total_travelled_time: string;


}
export interface DetailEntity {
  max_speed: string;
  avg_speed: string;
  total_travelled_time: string;
  total_distance: string;
  report_date: string;
  vehicle_number: string;
  cumulative_distance:string;
  vehicle_type: string;
  device_link_id: string;
  device_id: string;
}
