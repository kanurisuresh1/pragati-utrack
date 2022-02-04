
export interface GeofenceReport {
    status: boolean;
    message: string;
    data: GeofenceReportDetails[];
}
export interface GeofenceReportDetails {
    geofence_id: string;
    device_id: string;
    enter_time: string;
    exit_time: string;
    duration: string;
    geofence_name: string;
    vehicle_number: string;
    device_link_id: string;
    vehicle_type: string;
}




