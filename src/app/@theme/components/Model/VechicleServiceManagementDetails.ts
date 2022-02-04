export interface ServiceList {
    vehicle_service_trans_id: string;
    vehicle_service_id: string;
    service_id: string;
    service_status: string;
    service_name: string;
}

export interface ServiceVehicleServiceDetails {
    report_day: any;
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
    haveImage: boolean;
    added_date: string;
    modified_date: string;
    status: string;
    vehicle_number: string;
    vehicle_type: string;
    product_type: string;
    customer_name: string;
    service_list: ServiceList[];
}

export interface AllVehicleServiceManagement {
    status: boolean;
    message: string;
    data: ServiceVehicleServiceDetails[];
}