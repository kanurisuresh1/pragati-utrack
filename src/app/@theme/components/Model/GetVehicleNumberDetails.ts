export interface GetVehicleDetailsData {
    vehicle_detail_id: string;
    user_id: string;
    device_link_id: string;
    driver_id: string;
    hub_id: string;
    vehicle_image: string;
    engine_number: string;
    chassis_number: string;
    make: string;
    model: string;
    min_temp: string;
    max_temp: string;
    over_speed: string;
    buy_date: string;
    fuel_tank_size: string;
    fuel_type: string;
    mileage_per_litre: string;
    vehicle_registration_date: string;
    registered_owner_name: string;
    insurance_vender_name: string;
    insurance_cost: string;
    insurance_number: string;
    insurance_buy_date: string;
    insurance_renewal_date: string;
    pollution_check_date: string;
    pollution_check_renewal_date: string;
    pollution_check_cost: string;
    national_permit_id: string;
    national_permit_date: string;
    national_permit_renewal_date: string;
    empty_truck_avg_mileage: string;
    truck_mobile_device_token: string;
    vehicle_full_image: string;
    vehicle_number_image: string;
    device_image: string;
    sim_image: string;
    fitness_certificate_id?: any;
    fitness_certificate_date?: any;
    fitness_certificate_renewal_date?: any;
    tax_invoice_id?: any;
    tax_invoice_date?: any;
    tax_invoice_renewal_date?: any;
    state_permit_name?: any;
    state_permit_id?: any;
    state_permit_date?: any;
    state_permit_renewal_date?: any;
    added_date: string;
    modified_date: string;
    status: string;
    imei: string;
    vehicle_type_id: string;
    vehicle_type: string;
    driver_name: string;
    driver_mobile: string;
    hub_name: string;
    vehicle_image_list: any[];


}
export interface VehicleImageList {
    vehicle_image_id: string;
    user_id: string;
    device_link_id: string;
    image_file: string;
    image_type: string;
    added_date: string;
    modified_date: string;
    status: string;
}
export interface GetVehicleDetails {
    status: boolean;
    message: string;
    data: GetVehicleDetailsData;
}
