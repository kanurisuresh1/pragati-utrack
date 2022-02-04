export interface service_master_list_data {
    service_id: string;
    service_name: string;
}

export interface service_master_list {
    status: boolean;
    message: string;
    data: service_master_list_data[];
}
