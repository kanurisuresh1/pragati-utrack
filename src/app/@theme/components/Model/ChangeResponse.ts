export interface ChangeEmailResponse {
    status: boolean;
    message: string;
    data: ChangeEmailResponseData;
  }
  export interface ChangeEmailResponseData {
    verify_code: number;
  }
  