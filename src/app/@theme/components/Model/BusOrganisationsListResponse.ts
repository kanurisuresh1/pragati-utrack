export interface BusOrganisationsListResponse {
    status: boolean
    message: string
    data: BusOrganisationsListResponseData[]
}

export interface BusOrganisationsListResponseData {
    bus_organisation_id: string
    org_name: string
    logo_image: string
    org_type: string
    bus_visibility: string
    track_history_visibility: string
    added_date_time: string
    updated_date_time: string
    status: string
}
