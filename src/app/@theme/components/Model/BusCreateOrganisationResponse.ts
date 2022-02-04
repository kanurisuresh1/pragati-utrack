export interface BusCreateOrganisationResponse {
    status: boolean
    message: string
    data: BusCreateOrganisationResponseData
}

export interface BusCreateOrganisationResponseData {
    bus_organisation_id: number
}
