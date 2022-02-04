export interface OverSpeedReportRespones {
    status: boolean
    message: string
    exe_time: string
    data: OverSpeedReportResponesData1[]
  }
  
  export interface OverSpeedReportResponesData1 {
    fdt: string
    tdt: string
    d: string
    ms: string
    as: string
    td: string
    l: string
    data: OverSpeedReportResponesData2[]
  }
  
  export interface OverSpeedReportResponesData2 {
    la: string
    lo: string
    s: string
    c: string
    dt: string
  }
  