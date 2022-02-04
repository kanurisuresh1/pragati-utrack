export interface SharedUsersResponseDetailsData {
    device_link_id: string;
    vehicle_image: string;
    vehicle_number: string;
    vehicle_type: string;
    product_type: string;
    is_device_assigned: number;

    checked: boolean;

}

export interface SharedUsersResponseDetails {
    status: boolean;
    message: string;
    data: SharedUsersResponseDetailsData[];
}
