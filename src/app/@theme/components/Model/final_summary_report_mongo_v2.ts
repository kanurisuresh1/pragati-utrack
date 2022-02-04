
  export interface finalSummaryReportMongov2 {
    status: boolean
    message: string
    exe_time: string
    count: number
    data: Data
  }
  
  export interface Data {
    track_report: TrackReport[]
    device_report_stats_custom: DeviceReportStatsCustom
  }
  
  export interface TrackReport {
    s: number
    c: number
    cd: string
    la: number
    lo: number
    nt: number
    t: number
    l: string
  }
  
  export interface DeviceReportStatsCustom {
    max_speed: string
    avg_speed: string
    total_distance: string
    total_travelled_time: string
    ttts: number
  }
  
  