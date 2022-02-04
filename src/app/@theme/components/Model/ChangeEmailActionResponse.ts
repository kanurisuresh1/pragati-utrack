export interface ChangeEmailActionResponse {
    status: boolean;
    message: string;
    data: Data;
  }
  export interface Data {
    user_id: string;
    email: string;
  }
  