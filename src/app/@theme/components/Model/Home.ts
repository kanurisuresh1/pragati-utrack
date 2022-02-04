export interface HomeData {
    checked: boolean;

    positionindexvalue: number;

    listimage: string;
    table_listimage: string;
    device_link_id: string;
    device_id: string;
    device_imei: string;
    gps_lock_status: any;
    vehicle_number: string;
    vehicle_name: string;
    expiry_date: string;
    vehicle_type: string;
    customer_id: string;
    customer_name: string;
    customer_image: string;
    customer_mobile: string;
    product_type: string;
    vehicle_image: string;
    driver_id: string;
    temp_driver_id: string;
    nick_name: string;
    driver_name: string;
    driver_mobile: string;
    latitude: string;
    longitude: string;
    course: string;
    speed: string;
    speed_formatted: any;
    servertime: string;
    devicetime: string;
    attributes: string;
    valid: string;
    fixtime: string;
    day_distance: string;
    last_running_time: string;
    last_location: string;
    last_loc_distance: string;
    ignition: boolean;
    motion_status: boolean;
    fuel_point: string;
    temp1: string;
    batteryLevel: string;
    device_user_list_count: number;
    inprogress_trip: any;
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
    location_formatted: string;

    // Dynamic Color
    vehicle_motion_status_color: string;
    vehicle_motion_status_image: string;
    vehicle_motion_status: string; // 0-Yellow,1-Red,2-Green

    // new params for state map
    last_district: string;
    last_city: string;
    last_state: string;
    last_state_id: string;

    // new param for POWER STATUS in vehicle status
    power_status: string;

    // gps lock
    with_realm: string;

    // color images for the fuel tank in Ltrs
    fuel_point_motion_image: string;


}

export interface Home {
    status: boolean;
    message: string;
    data: HomeData[];
}
