export interface BusCreateTimingResponse {
    status: boolean
    message: string
    data: BusCreateTimingResponseData
}

export interface BusCreateTimingResponseData {
    bus_route_timing_id: number
}
