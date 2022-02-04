export interface BusCreateBrachResponse {
    status: boolean
    message: string
    data: BusCreateBrachResponseData
}

export interface BusCreateBrachResponseData {
    bus_organisation_id: string
    bus_organisation_branch_id: number
}
