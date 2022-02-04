export interface TripCreateResponse {
    status: boolean;
    message: string;
    data: Data;
  }
  export interface Data {
    trip_code: string;
  }
  