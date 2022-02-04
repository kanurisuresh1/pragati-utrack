export interface Detail {
    report_day: string;
    max_speed: string;
    avg_speed: string;
    report_date: string;
    total_travelled_time: string;
    total_distance: string;
    free_wheeling_distance:string;
}

export interface DayWiseKmReportData {
    detail: Detail[];
    max_speed: string;
    avg_speed: string;
    total_distance: string;
    total_travelled_time: string;
    free_wheeling_distance:string;
}

export interface DayWiseKmReport {
    status: boolean;
    message: string;
    data: DayWiseKmReportData;
}
