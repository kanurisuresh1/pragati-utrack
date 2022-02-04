export interface ForgotPasswordResponseData {
    verify_code: number;
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    mobile: string;
    sms_response: string;
}

export interface ForgotPasswordResponse {
    status: boolean;
    message: string;
    data: ForgotPasswordResponseData;
}
