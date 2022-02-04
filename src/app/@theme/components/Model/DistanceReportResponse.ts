export interface distanceReportResponse {
    status: boolean
    message: string
    exe_time: string
    count: number
    data: distanceReportResponseData[]
  }
  
  export interface distanceReportResponseData {
    fdt: string
    tdt: string
    d: string
    cd: string
  }
  