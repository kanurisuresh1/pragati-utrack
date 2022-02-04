export interface TripDetailResponse {
    status: boolean;
    message: string;
    data: TripDetailResponseData;
  }
  export interface TripDetailResponseData {
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
    actual_start_date_time?: null;
    actual_start_lat?: null;
    actual_start_lon?: null;
    actual_start_location?: null;
    actual_end_date_time?: null;
    actual_end_lat?: null;
    actual_end_lon?: null;
    actual_end_location?: null;
    start_odometer_reading: string;
    end_odometer_reading: string;
    feedback_rating: string;
    feedback_text?: null;
    added_date: string;
    modified_date: string;
    status: string;
    vehicle_number?: null;
    trip_stop_list?: TripStopListEntity[] ;
    trip_expenses_list?: TripExpensesListEntity[];
    vehicle_fuel_list?: VehicleFuelListEntity[] ;
    vehicle_service_list?: VehicleServiceListEntity[] ;
  }
  export interface TripStopListEntity {
    showDataOne: boolean;
    showDataZero: boolean;
    VisitedDatetime: string;
    trip_stop_id: string;
    trip_id: string;
    route_type: string;
    start_station_id: string;
    end_station_id: string;
    stop_lat: string;
    stop_lon: string;
    stop_location: string;
    visited_date_time?: null;
    odometer_reading: string;
    added_date: string;
    modified_date?: null;
    visited_status: string;
  }
  export interface TripExpensesListEntity {
    expenseDate: string;
    trip_expense_id: string;
    trip_id: string;
    expense_type: string;
    expense_date: string;
    expense_notes: string;
    amount: string;
    receipt_image: string;
    added_date: string;
    modified_date: string;
    status: string;
  }
  export interface VehicleFuelListEntity {
    fillingDate: string;
    vehicle_fuel_id: string;
    device_link_id: string;
    user_id: string;
    trip_id: string;
    filling_date: string;
    odometer_reading: string;
    quantity: string;
    price_per_liter: string;
    total_cost: string;
    filling_station: string;
    filling_notes: string;
    bill_image: string;
    added_date: string;
    modified_date: string;
    status: string;
  }
  export interface VehicleServiceListEntity {
    serviceDate: string;
    vehicle_service_id: string;
    device_link_id: string;
    user_id: string;
    trip_id: string;
    service_date: string;
    odometre_reading: string;
    service_center_name: string;
    service_cost: string;
    service_notes: string;
    report_file: string;
    added_date: string;
    modified_date?: null;
    status: string;
    service_list?: ServiceListEntity[];
  }
  export interface ServiceListEntity {
    vehicle_service_trans_id: string;
    vehicle_service_id: string;
    service_id: string;
    service_status: string;
    service_name: string;
  }
  