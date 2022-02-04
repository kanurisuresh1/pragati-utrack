

export interface SingleCustomDeviceReportStatsResponse {
  status: boolean
  message: string
  data: SingleCustomData
}

export interface SingleCustomData {
  detail: SingleCustomDeviceDetail[]
  max_speed: string
  avg_speed: string
  total_distance: string
  total_travelled_time: string
}

export interface SingleCustomDeviceDetail {
  max_speed: string
  avg_speed: string
  total_travelled_time: string
  total_distance: string
  report_date: string
  report_day: string
}

