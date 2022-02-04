export interface DeviceReportStatsCustom {
    max_speed: string;
    avg_speed: string;
    total_distance: string;
    total_travelled_time: string;
}

export interface TrackReport {
    rd: string;
    s: number;
    d: number;
    la: number;
    lo: number;
    nt: number;
    c: number;
    io16: number;
    ln: string;
    ld: string;
    date: any;


    motion: boolean;
    motionType: string;
    motionTypeColor: string;

    fromDate: Date;
    toDate: Date;
    toNT: number;
    fromNT: number;

    distance: number;

    durationInSecs: number;
    durationFormatted: string;

}

export interface Detail {
    max_speed: string;
    avg_speed: string;
    total_travelled_time: string;
    total_distance: string;
    report_date: string;
}

export interface ThisMonth {
    detail: Detail[];
    max_speed: string;
    avg_speed: string;
    total_distance: string;
    total_travelled_time: string;
}

export interface KmsSummaryReport {
    device_link_id: string;
    device_id: string;
    vehicle_number: string;
    vehicle_type: string;
    this_month: ThisMonth;
}

export interface OverSpeedReportData {
    latitude: number;
    longitude: number;
    speed: number;
    course: number;
    devicetime: string;
}

export interface OverSpeedReportDataFormatted {
    latitude: number;
    longitude: number;
    speed: number;
    from_time: string;
    to_time: string;
    duration: string;
    distance: string;
    location: string;

    durationInSec: number;

}

export interface TrackHistoryReportResponseData {
    device_report_stats_custom: DeviceReportStatsCustom;
    over_speed_report: OverSpeedReportData[][];
    track_report: TrackReport[];
    kms_summary_report: KmsSummaryReport;
}

export interface TrackHistoryReportResponse {
    status: boolean;
    message: string;
    exe_time: string;
    data: TrackHistoryReportResponseData;
}
