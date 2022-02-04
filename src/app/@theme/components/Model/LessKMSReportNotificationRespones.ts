export interface LessKmsReportNotificationResponse {
    status: boolean;
    message: string;
    data?: LessKmsReportNotificationResponseData[];
}
export interface LessKmsReportNotificationResponseData {
    lessStartdate: string;
    lessStartTime: string;
    lessEndTime: string;
    alert_type: string;
    slot: string;
    start_date_time: string;
    end_date_time: string;
    vehicle_list?: VehicleListEntity[];
}
export interface VehicleListEntity {
    device_link_id: string;
    device_id: string;
    vehicle_number: string;
    vehicle_type: string;
    vehicle_less_km_report_id: string;
    added_date: string;
    start_date_time: string;
    end_date_time: string;
    total_distance: string;
    report_date: string;
    slot: string;
    alert_type: string;
}
