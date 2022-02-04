
export interface FastTagResponseData {
    fasttag_trans_id: string;
    fasttag_account_id: string;
    user_id: string;
    device_link_id: string;
    processing_date_time: string;
    transaction_date_time: string;
    transaction_amount: string;
    transaction_id: string;
    hex_tag_id: string;
    vehicle_number: string;
    lane_code: string;
    plaza_code: string;
    transaction_status: string;
    transaction_reference_number: string;
    plaza_name: string;
    toll_plaza_id: string;
    added_date: string;
}

export interface FastTagResponse {
    status: boolean;
    message: string;
    count: number;
    data: FastTagResponseData[];
}


