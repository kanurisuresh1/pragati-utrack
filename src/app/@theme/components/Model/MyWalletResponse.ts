export interface MyWalletResponseData {
    user_wallet_trans_id: string;
    referred_user_id: string;
    referee_name: string;
    imei: string;
    device_name: string;
    device_model: string;
    executive_cost: string;
    payment_type: string;
    transaction_type: string;
    amount: string;
    added_date: string;
    status: string;
    description: string;
}

export interface MyWalletResponse {
    status: boolean;
    message: string;
    data: MyWalletResponseData[];
}