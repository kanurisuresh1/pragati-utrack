
  export interface SingleDeviceReportStatusReportV1Response {
    status: boolean
    message: string
    data: SingleDeviceReportStatusReportV1ResponseData[]
  }
  
  export interface SingleDeviceReportStatusReportV1ResponseData {
    device_link_id: string
    device_id: string
    vehicle_number: string
    vehicle_type: string
    today: Today
    this_week: ThisWeek
    last_7: Last7
    this_month: ThisMonth
  }
  
  export interface Today {
    ms: string
    as: string
    ttt: string
    td: string
    rd: string
    day: string
  }
  
  export interface ThisWeek {
    detail: Detail[]
    ms: string
    as: string
    td: string
    ttt: string
  }
  
  export interface Detail {
    ms: string
    as: string
    ttt: string
    td: string
    rd: string
    day: string
  }
  
  export interface Last7 {
    detail: Detail[]
    ms: string
    as: string
    td: string
    ttt: string
  }
  
  export interface ThisMonth {
    detail: Detail[]
    ms: string
    as: string
    td: string
    ttt: string
  }
  
 
  