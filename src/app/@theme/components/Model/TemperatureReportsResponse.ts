export interface TemperatureReportResponse {
    status: boolean
    message: string
    exe_time: string
    count: number
    data: TemperatureResponseData[]
  }
  
  export interface TemperatureResponseData {
    s: string
    d: string
    la: string
    lo: string
    t: string
    l: string
  }
  