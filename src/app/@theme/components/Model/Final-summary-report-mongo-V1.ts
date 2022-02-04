export interface NewTrackHistoryDiv {
    status: boolean
    message: string
    exe_time: string
    data: NewTrackHistoryData
  }
  
  export interface NewTrackHistoryData {
    device_report_stats_custom: DeviceReportStatsCustom
    track_report: TrackReport[]
  }
  
  export interface DeviceReportStatsCustom {
    max_speed: string
    avg_speed: string
    total_distance: string
    total_travelled_time: string
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
  