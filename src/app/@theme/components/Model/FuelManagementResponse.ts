export interface FuelManagementDetails {
    report_day: any;
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
    haveImage: boolean;
    bill_image: string;
    added_date: string;
    modified_date: string;
    status: string;
    vehicle_number: string;
    vehicle_type: string;
    product_type: string;
    customer_name: string;
}

export interface FuelManagementResponse {
    status: boolean;
    message: string;
    data: FuelManagementDetails[];
}
