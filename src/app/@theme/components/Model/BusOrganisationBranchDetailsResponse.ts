export interface BusOrganisationBranchDetailsResponse {
    status: boolean
    message: string
    data: BusOrganisationBranchDetailsResponseData
}

export interface BusOrganisationBranchDetailsResponseData {
    bus_organisation_branch_id: string
    bus_organisation_id: string
    branch_name: string
    branch_location: string
    google_location: string
    latitude: string
    longitude: string
    user_id: string
    modified_by: string
    added_date_time: string
    updated_date_time: string
    status: string
    org_name: string
    staff_count: string
    routes_count: string
    buses_count: string
    passengers_count: string
}
