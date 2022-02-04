export interface GeofenceCustomAlertListResponse {
    status: boolean;
    data: GeofenceCustomAlertListDataEntity[] ;
    message: string;
  }
  export interface GeofenceCustomAlertListDataEntity {
    status_type_button_color: string;
    geofence_custom_alert_id: string;
    user_id: string;
    device_link_ids: string;
    geofence_id: string;
    mobile_numbers: string;
    email_ids: string;
    from_date_time: string;
    to_date_time: string;
    added_date: string;
    geofence_name :string;
    vehicle_numbers:string;
    modified_date?: null;
    status: string;
  }
  