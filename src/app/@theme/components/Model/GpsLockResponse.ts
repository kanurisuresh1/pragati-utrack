export interface GpsLockResponse {
    status: boolean;
    message: string;
    data: Data;
  }
  export interface Data {
    sms_message: string;
    verify_code: number;
  }
  