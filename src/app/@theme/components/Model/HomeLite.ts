export interface HomeLiteData {
    device_link_id: string;
    device_id: string;
    device_imei: string;
    gps_lock_status: string;
    vehicle_number: string;
    vehicle_name: string;
    vehicle_type: string;
    product_type: string;
    vehicle_image: string;
    latitude: string;
    longitude: string;
    speed: string;
    devicetime: string;
    course: string;
    last_location: string;
    last_loc_distance: string;
    fixtime: string;
}

export interface HomeLite {
    status: boolean;
    message: string;
    data: HomeLiteData[];
}