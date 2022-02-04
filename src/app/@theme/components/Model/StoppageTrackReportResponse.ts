export interface stoppageTrackReportResponse {
    status: boolean
    message: string
    exe_time: string
    data: stoppageTrackReportResponseData[]
  }
  
  export interface stoppageTrackReportResponseData {
    ttd: string
    type: string
    mcc: string
    fdt: string
    tdt: string
    ttts: number
    ttt: string
    l: string
    la: string
    lo: string
  }
  