export interface BusTripsListResponse {
    status: boolean
    message: string
    data: BusTripsListResponseData[]
}

export interface BusTripsListResponseData {
    bus_trip_id: string
    service_no: string
    bus_organisation_id: string
    bus_organisation_branch_id: string
    bus_route_timing_id: string
    bus_route_id: string
    trip_start_time: string
    trip_end_time: string
    trip_type: string
    route_name: string
    branch_name: string
    org_name: string
    vehicle_number: string
}
