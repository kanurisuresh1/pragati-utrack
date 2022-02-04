export interface TripResponseData {
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
    actual_end_date_time: string;
    actual_end_lat: string;
    actual_end_lon: string;
    actual_end_location: string;
    start_odometer_reading: string;
    end_odometer_reading: string;
    feedback_rating: string;
    feedback_text?: any;
    added_date: string;
    modified_date: string;
    status: string;
    vehicle_number: string;
    driver_name?: any;
    driver_image: string;
    driver_mobile?: any;
}

export interface TripResponse {
    status: boolean;
    message: string;
    data: TripResponseData[];
}