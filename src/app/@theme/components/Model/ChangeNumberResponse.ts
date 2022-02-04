export interface ChangeNumberResponse {
    status: boolean;
    message: string;
    data: ChangeNumberResponseData;
  }
  export interface ChangeNumberResponseData {
    verify_code: number;
  }
  