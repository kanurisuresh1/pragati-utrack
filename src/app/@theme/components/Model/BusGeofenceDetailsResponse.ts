export interface BusGeofenceDetailsResponse {
    status: boolean
    message: string
    data: BusGeofenceDetailsResponseData
}

export interface BusGeofenceDetailsResponseData {
    device_geofence_trans_id: string
    user_id: string
    geofence_id: string
    geofence_name: string
    latitude: string
    longitude: string
    location_name: string
    radius: string
    added_date: string
    modified_date: string
    bus_organisation_id: string
    bus_organisation_branch_id: string
    status: string
}
