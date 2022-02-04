export interface MyRoutesInterMediateStopsResponse {
    status: boolean;
    message: string;
    data?: MyRoutesInterMediateStopsResponseData[];
}
export interface MyRoutesInterMediateStopsResponseData {
    stop_lat: string;
    stop_location: string;
    stop_lon: string;
    is_return_stop: string;
}
