export interface HubManagementResponseData {
    hub_id: string;
    user_id: string;
    hub_name: string;
    hub_location: string;
    latitude: string;
    longitude: string;
    state_id: string;
    district_id: string;
    manager_name: string;
    manager_number: string;
    added_date: string;
    modified_date: string;
    status: string;
    state: string;
    district_name: string;
    customer_name: string;
    mobile: string;
    vehicle_list: VehicleList[];
}


export interface VehicleList {
    device_link_id: string;
    vehicle_image: string;
    vehicle_number: string;
    vehicle_detail_id: string;
    vehicle_type: string;

}

export interface HubManagementResponse {
    status: boolean;
    data: HubManagementResponseData[];
    message: string;
}