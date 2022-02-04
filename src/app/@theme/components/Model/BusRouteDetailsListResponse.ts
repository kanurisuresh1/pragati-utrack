export interface BusRouteDetailsListResponse {
    status: boolean
    message: string
    data: BusRouteDetailsListResponseData
}
export interface BusRouteDetailsListResponseData {
    bus_route_id: string
    route_name: string
    from_geofence_id: string
    to_geofence_id: string
    bus_organisation_id: string
    bus_organisation_branch_id: string
    added_by_id: string
    modified_by_id: string
    added_date_time: string
    updated_date_time: string
    status: string
    from_geofence_name: string
    from_location_name: string
    from_latitude: string
    from_longitude: string
    from_radius: string
    to_geofence_name: string
    to_location_name: string
    to_latitude: string
    to_longitude: string
    to_radius: string
    branch_name: string
    org_name: string
    drop_point: PickupDropPoint[]
    pickup_point: PickupDropPoint[]
}

export interface PickupDropPoint {
    bus_point_id: string
    bus_route_id: string
    bus_organisation_branch_id: string
    bus_organisation_id: string
    point_type: string
    geofence_id: string
    previous_location_duration_mins: string
    sequence: string
    added_by_id: string
    modified_by_id: string
    added_date_time: string
    modified_date_time: string
    status: string
    point_geofence_name: string
    point_location_name: string
    point_latitude: string
    point_longitude: string
    point_radius: string
}


