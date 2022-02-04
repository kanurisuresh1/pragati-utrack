export interface FastTagDetailsResponseData {
    fasttag_account_id: string;
    user_id: string;
    fasttag_bank_id: string;
    fasttag_api_key: string;
    fasttag_api_client_id: string;
    last_sync_date_time: string;
    added_date: string;
    modified_date: string;
    status: string;
    bank_name: string;
    bank_code: string;
}

export interface FastTagDetailsResponse {
    status: boolean;
    message: string;
    data: FastTagDetailsResponseData[];
}
