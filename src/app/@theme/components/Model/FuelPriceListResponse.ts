export interface FuelPriceListResponse {
    status: boolean
    message: string
    data: FuelPriceListResponseData[]
}

export interface FuelPriceListResponseData {
    city_name: string
    petrol_price: string
    diesel_price: string
}
