
export interface TollPlazaResponseData {
    toll_plaza_id: string;
    toll_name: string;
    location: string;
    latitude: string;
    longitude: string;
    project_type: string;
    car_single: string;
    car_multi: string;
    car_monthly: string;
    lcv_single: string;
    lcv_multi: string;
    lcv_monthly: string;
    bus_single: string;
    bus_multi: string;
    bus_monthly: string;
    multiaxle_single: string;
    multiaxle_multi: string;
    multiaxle_monthly: string;
    hcm_single: string;
    hcm_multi: string;
    hcm_monthly: string;
    four_six_axle_single: string;
    four_six_axle_multi: string;
    four_six_axle_monthly: string;
    seven_plus_axle_single: string;
    seven_plus_axle_multi: string;
    seven_plus_axle_monthly: string;
    contractor_name: string;
    last_modified_date: string;
    state: string;
    district: string;
}

export interface TollPlazaResponse {
    status: boolean;
    message: string;
    count: number;
    data: TollPlazaResponseData[];
}
export interface TollDetails {
    vehicle_type: string;
    single: string;
    multi: string;
    monthly: string;
}

