export interface Home_V1_Data {
    device_link_id: string;
    device_id: string;
    device_imei: string;
    gps_lock_status: string;
    vehicle_number: string;
    vehicle_name: string;
    with_realm: string;
    expiry_date: string;
    vehicle_type: string;
    customer_id: string;
    customer_name: string;
    customer_image: string;
    customer_mobile: string;
    product_type: string;
    vehicle_image: string;
    driver_id: string;
    nick_name: string;
    driver_name: string;
    driver_mobile: string;
    latitude: string;
    longitude: string;
    course: string;
    speed: string;
    servertime: string;
    devicetime: string;
    fixtime: string;
    day_distance: string;
    last_running_time: string;
    power_status: string;
    last_area: string;
    last_district: string;
    last_city: string;
    last_state: string;
    last_state_id: string;
    landmark: string;
    dtime: string;
    ignition: boolean;
    motion_status: boolean;
    fuel_point: string;
    temp1: string;
    batteryLevel: string;
    device_user_list_count: number;
    inprogress_trip: any;

    checked: boolean;

    positionindexvalue: number;

    listimage: string;
    temp_driver_id: string;
    attributes: string;
    valid: string;
    last_location: string;
    last_loc_distance: string;
    stopped_time: string;

    stopped_time_formatted: string;

    fuel_tank_size: string; // added for Dashboard List View Table column

    // Trip added parameters

    trip_name: string;
    trip_status: string;
    trip_comment: string;
    route_name: string;
    trip_customer_name: string;


    driver_details_formatted: string;

    // Dynamic Color
    vehicle_motion_status_color: string;
    vehicle_motion_status_image: string;
    vehicle_motion_status: string; // 0-Yellow,1-Red,2-Green

    fuel_point_motion_image: string;

}

export interface Home_V1 {
    status: boolean;
    message: string;
    data: Home_V1_Data[];
}



