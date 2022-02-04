export interface BusCreateGeofenceResponse {
    status: boolean
    data: BusCreateGeofenceResponseData
    message: string
}

export interface BusCreateGeofenceResponseData {
    device_geofence_trans_id: string
    geofence_id: string
    user_id: string
    geofence_name: string
    latitude: string
    longitude: string
    location_name: string
    radius: string
    geofence_type: string
    added_date: string
    modified_date: any
    status: string
}
