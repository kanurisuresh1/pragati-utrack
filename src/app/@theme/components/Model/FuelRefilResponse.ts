export interface FuelRefilResponseData {
    status: boolean;
    message: string;
    data: Data;
}
export interface Data {
    Refill?: RefillEntityOrTheftEntity[];
    Theft?: RefillEntityOrTheftEntity[];
}
export interface RefillEntityOrTheftEntity {
    vehicle_fuel_refill_id: string;
    device_link_id: string
    type: string;
    fuel_change_liters: string;
    landmark: string;
    latitude: string;
    longitude: string;
    filling_station_name: string;
    rate_of_fuel_per_liter: string;
    report_day: string;
    vehicle_number: string;
    device_id: string;
    vehicle_type: string;
    latlng: string;
    fuel_amount: string;
    report_date: string;
}
