export interface ChangeMobileActionResponse {
    status: boolean;
    message: string;
    data: Data;
  }
  export interface Data {
    user_id: string;
    mobile: string;
  }
  