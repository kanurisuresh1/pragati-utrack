export interface AlertHistoryResponse {
    status: boolean
    data: AlertHistoryResponseData[]
    message: string
}

export interface AlertHistoryResponseData {
    temp_alert_history_id: string
    temp_alert_id: string
    alert_type: string
    alert_sub_type: string
    device_link_id: string
    device_id: string
    message: string
    added_date: string
    vehicle_number: string
    vehicle_type: string
}
