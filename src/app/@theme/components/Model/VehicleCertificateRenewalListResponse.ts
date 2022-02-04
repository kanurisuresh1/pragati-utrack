export interface VehicleCertificateRenewalListResponse {
    status: boolean
    data: VehicleCertificateRenewalListResponseData[]
    message: string
}

export interface VehicleCertificateRenewalListResponseData {
    vehicle_detail_id: string
    device_link_id: string
    vehicle_number: string
    certificate: string
    expire_date: string
    status: string
    expire_date_time_stamp: number
}
