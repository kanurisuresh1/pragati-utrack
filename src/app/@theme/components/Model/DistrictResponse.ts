export interface Districts {
    district_id: string;
    district: string;
}

export interface DistrictResponse {
    status: boolean;
    message: string;
    data: Districts[];
}
