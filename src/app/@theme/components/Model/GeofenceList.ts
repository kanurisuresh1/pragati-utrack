
    export interface GeofenceListDetails {
        device_geofence_trans_id: string;
        user_id: string;
        geofence_id: string;
        geofence_name: string;
        latitude: string;
        longitude: string;
        location_name: string;
        radius: string;
        added_date: string;
        modified_date: string;
        status: string;
    }

    export interface GeofenceList {
        status: boolean;
        message: string;
        data: GeofenceListDetails[];
    }



