export interface CreateGeofenceResponse {
    status: boolean;
    data: Data;
    message: string;
  }
  export interface Data {
    device_geofence_trans_id: string;
    user_id: string;
    geofence_name: string;
    latitude: string;
    longitude: string;
    location_name: string;
    radius: string;
    added_date: string;
    modified_date?: null;
    status: string;
  }
  