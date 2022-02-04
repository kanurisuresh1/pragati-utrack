export interface BusCreatePassengersResponse {
    status: boolean
    message: string
    data: BusCreatePassengersResponseData
}

export interface BusCreatePassengersResponseData {
    bus_passenger_id: number
}
