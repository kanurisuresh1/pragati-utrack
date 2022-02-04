export interface BusCreateRoutePointResponse {
    status: boolean
    message: string
    data: BusCreateRoutePointResponseData
}

export interface BusCreateRoutePointResponseData {
    bus_point_id: number
}
