export interface Today {
    max_speed: string;
    avg_speed: string;
    total_travelled_time: string;
    total_distance: string;
    free_wheeling_time: string,
    free_wheeling_distance: string
}

export interface AllDeviceReportStatus24HoursData {
    device_link_id: string;
    device_id: string;
    vehicle_number: string;
    today: Today;
}

export interface AllDeviceReportStatus24Hours {
    status: boolean;
    message: string;
    data: AllDeviceReportStatus24HoursData[];
}
