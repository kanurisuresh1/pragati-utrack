export interface AllPositionsReport {
    status: boolean
    message: string
    exe_time: string
    count: number
    data: AllPositionsReportResponse[]
  }
  
  export interface AllPositionsReportResponse {
    s: number
    cd: string
    la: number
    lo: number
    d: string
    t: string
    l: string
  }
  