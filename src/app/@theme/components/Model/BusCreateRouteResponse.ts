export interface BusCreateRouteResponse {
    status: boolean
    message: string
    data: BusCreateRouteResponseData
}

export interface BusCreateRouteResponseData {
    bus_route_id: number
}
