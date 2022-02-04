export interface FastTagBanksResponseData {
    fasttag_bank_id: string;
    bank_name: string;
    bank_code: string;
    status: string;
}

export interface FastTagBanksResponse {
    status: boolean;
    message: string;
    data: FastTagBanksResponseData[];
}
