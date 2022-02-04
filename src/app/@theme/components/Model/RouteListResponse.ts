export interface RouteListResponse {
    status: boolean;
    message: string;
    data?: RouteListResponseData[] ;
  }
  export interface RouteListResponseData {
    route_id: string;
    user_id: string;
    route_type: string;
    start_station_id: string;
    end_station_id: string;
    route_name: string;
    start_location: string;
    start_lat: string;
    start_lon: string;
    end_location: string;
    end_lat: string;
    end_lon: string;
    is_round_trip: string;
    route_notes: string;
    distance: string;
    travel_time_mins: string;
    stop_json: string;
    added_date: string;
    modified_date: string;
    status: string;
  }
  