
export interface SharedManagementListRepsonseData {
    trip_share_id: string;
    share_code: string;
    user_id: string;
    device_link_id: string;
    type: string;
    live_duration: string;
    time_created: string;
    modified_date: string;
    status: string;
    vehicle_number: string;
    vehicle_type: string;
    time_left_mins: number;

    status_type_converted: string;
    status_type_button_color: string;

}

export interface SharedManagementListRepsonse {
    status: boolean;
    data: SharedManagementListRepsonseData[];
    message: string;
}


