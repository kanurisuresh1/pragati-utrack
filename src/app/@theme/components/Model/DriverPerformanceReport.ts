
export interface DriverPerformanceReport {
    status: boolean;
    message: string;
    data: DriverPerformanceReportDetails[];
}
export interface DriverPerformanceReportDetails {
    report_day: string;
    vehicle_analysis_id: string;
    device_link_id: string;
    device_id: string;
    vehicle_number: string;
    vehicle_type: string;
    report_date: string;
    driver_id: string;
    driver_name: string;
    driver_number: string;
    customer_id: string;
    customer_name: string;
    customer_number: string;
    total_distance: string;
    total_night_distance: string;
    total_day_distance: string;
    max_speed: string;
    avg_speed: string;
    sudden_accerlation: string;
    sudden_deceleration: string;
    total_stopped_time: string;
    total_travelled_time: string;
    total_night_travelled_time: string;
    total_day_travelled_time: string;
    utilization: string;
    free_wheeling_distance: string,
    free_wheeling_time: string,
}




