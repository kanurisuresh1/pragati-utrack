export interface ChangePasswordResponse {
    status: boolean;
    message: string;
    data: ChangePasswordResponseData;
}
export interface ChangePasswordResponseData {
    user_id: string;
}
