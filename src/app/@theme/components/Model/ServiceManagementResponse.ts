export interface ServiceList {
    vehicle_service_trans_id: string;
    vehicle_service_id: string;
    service_id: string;
    service_status: string;
    service_name: string;
}

export interface ServiceManagementData {
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
    modified_date?: any;
    status: string;
    service_list: ServiceList[];
}

export interface ServiceManagementResponse {
    status: boolean;
    message: string;
    data: ServiceManagementData;
}