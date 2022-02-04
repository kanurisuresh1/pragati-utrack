export interface FuelAlertListResponse {
    status: boolean
    data: FuelAlertListResponseData[]
    message: string
}

export interface FuelAlertListResponseData {
    temp_alert_id: string
    device_link_id: string
    alert_type: string
    min_temp: string
    max_temp: string
    start_date_time: string
    end_date_time: string
    user_id: string
    driver_name: any
    driver_number: any
    trip_name: any
    email: any
    mobile_number: any
    added_date: string
    modified_date: any
    status: string
    vehicle_number: string
    status_type_button_color: string;
}
