
export interface DriverDetailsData {
    user_id: string;
    first_name: string;
    last_name: string;
    nick_name: string;
    mobile: string;
    profile_image: string;
    user_friend_id: string;
    type: string;
    dl_front: string;
    dl_back: string;
    joining_date: string;
    birth_date: string;
    pan_id: string;
    driving_licence_id: string;
    gender: string;
    p_front: string;
    blood_group: string;
    status: string;
    state_id: string;
    district_id: string;
    city_id: string;
    area: string;
    pincode: string;
    landmark: string;
    address: string;
    state?: any;
    district_name?: any;
    city?: any;
    driver_vehicle_list: DriverVehicleList[];
    trip_list: TripList[];
}

export interface DriverVehicleList {
    device_link_id: string;
    vehicle_image: string;
    vehicle_number: string;
    vehicle_detail_id: string;
}

export interface TripList {
    trip_id: string;
    trip_code: string;
    device_link_id: string;
    user_id: string;
    customer_id: string;
    driver_id: string;
    is_round_trip: string;
    route_id: string;
    route_type: string;
    start_station_id: string;
    end_station_id: string;
    trip_name: string;
    start_date_time: string;
    start_lat: string;
    start_lon: string;
    start_location: string;
    end_date_time: string;
    end_lat: string;
    end_lon: string;
    end_location: string;
    trip_notes: string;
    actual_start_date_time: string;
    actual_start_lat: string;
    actual_start_lon: string;
    actual_start_location: string;
    actual_end_date_time?: any;
    actual_end_lat?: any;
    actual_end_lon?: any;
    actual_end_location?: any;
    start_odometer_reading: string;
    end_odometer_reading: string;
    feedback_rating: string;
    feedback_text?: any;
    added_date: string;
    modified_date: string;
    status: string;
    vehicle_number: string;
}

export interface DriverDetails {
    status: boolean;
    message: string;
    data: DriverDetailsData[];
}



