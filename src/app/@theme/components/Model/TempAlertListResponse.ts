export interface TempAlertListResponse {
  status: boolean;
  data?: TempAlertListResponseData[];
  message: string;
}
export interface TempAlertListResponseData {
  EndDatETime: any;
  StartDateTime: any;
  AddDate: any;
  temp_alert_id: string;
  device_link_id: string;
  min_temp: string;
  max_temp: string;
  start_date_time: string;
  end_date_time: string;
  user_id: string;
  added_date: string;
  modified_date: string;
  status: string;
  vehicle_image: string;
  vehicle_number: string;
  vehicle_detail_id: string;
  vehicle_type: string;
  trip_name: string;
  driver_name: string;
  driver_number: string;
  email: string;
  mobile_number: string;

  status_type_button_color: string;

}
