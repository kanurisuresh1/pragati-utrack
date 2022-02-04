export interface CityResponceData {
    city_id: string;
    city: string;
}

export interface CityResponce {
    status: boolean;
    message: string;
    data: CityResponceData[];
}