export interface CompanyManagementDetailsResponseData {
    company_id: string;
    user_id: string;
    company_name: string;
    company_logo: string;
    company_website: string;
    company_state_id: string;
    company_district_id: string;
    company_city_id: string;
    company_address: string;
    company_latitude: string;
    company_longitude: string;
    company_landmark: string;
    company_area: string;
    company_pincode: string;
    company_email: string;
    company_mobile: string;
    added_date: string;
    modified_date: string;
    status: string;
    company_state: string;
    company_district_name: string;
    company_city: string;

    address1: string
    address2: string
    company_google_address: string

    company_address1: string;
    company_address2: string;

}

export interface CompanyManagementDetailsResponse {
    status: boolean;
    data: CompanyManagementDetailsResponseData;
    message: string;
}