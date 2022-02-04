export interface SummaryReportCustomDiv {
    status: boolean
    message: string
    exe_time: string
    data: SummaryReportCustomDivData
  }
  
  export interface SummaryReportCustomDivData {
    device_report_stats_custom: DeviceReportStatsCustom
    track_report: TrackReport[]
  }
  
  export interface DeviceReportStatsCustom {
    max_speed: number
    avg_speed: number
    total_distance: string
    total_travelled_time: string
  }
  
  export interface TrackReport {
    s: number
    d: number
    la: number
    lo: number
    nt: string
    c: number
    ln: string
    ld: string
  }
  