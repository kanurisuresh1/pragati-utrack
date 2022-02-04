export interface FuelStatesResponse {
    status: boolean
    message: string
    data: FuelStatesResponseData[]
}

export interface FuelStatesResponseData {
    fuel_state_id: string
    state: string
}
