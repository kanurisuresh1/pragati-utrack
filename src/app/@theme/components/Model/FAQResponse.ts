export interface FAQResponseData {
    facebook: string;
    instagram: string;
    twitter: string;
    customer_support_timings: string;
    youtube_how_to_use: string;
    contact_email: string;
    contact_number: string;
}

export interface FAQResponse {
    status: boolean;
    message: string;
    data: FAQResponseData;
}