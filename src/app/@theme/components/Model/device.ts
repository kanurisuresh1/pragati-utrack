export interface Today {
    max_speed: string;
    avg_speed: string;
    total_travelled_time: string;
    total_distance: string;
    report_date: string;
}

export interface Detail {
    max_speed: string;
    avg_speed: string;
    total_travelled_time: string;
    total_distance: string;
    report_date: string;
}

export interface ThisWeek {
    detail: Detail[];
    max_speed: number;
    avg_speed: string;
    total_distance: number;
    total_travelled_time: number;
}

export interface ThisMonth {
    detail: Detail[];
    max_speed: number;
    avg_speed: any;
    total_distance: number;
    total_travelled_time: number;
}

export interface DeviceVechicle {
    device_link_id: string;
    device_id: string;
    vehicle_number: string;
    vehicle_type: string;
    today: Today;
    this_week: ThisWeek;
    this_month: ThisMonth;
}

export interface DeviceList {
    status: boolean;
    message: string;
    data: DeviceVechicle[];
}