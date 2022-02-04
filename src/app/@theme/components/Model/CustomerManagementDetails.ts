// Customer Management List Start

export class CustomerManagementDetails {
    customer_id: string;
    user_id: string;
    full_name: string;
    company_name: string;
    profile_image: string;
    mobile: string;
    email: string;
    gst_number: string;
    state_id: string;
    address1: string;
    address2: string;
    added_date: string;
    updated_date: string;
    status: string;
    state: string;
}

export interface Customers {
    status: boolean;
    message: string;
    data: CustomerManagementDetails[];
}

// Customer Management List End


// Customer Management Details List Start


export interface CustomerManagementListDetails {
    customer_id: string;
    user_id: string;
    full_name: string;
    company_name: string;
    profile_image: string;
    mobile: string;
    email: string;
    gst_number: string;
    state_id: string;
    address1: string;
    address2: string;
    added_date: string;
    updated_date: string;
    status: string;
    state: string;
    trip_list: any[];
}

export interface CustomersDetails {
    status: boolean;
    message: string;
    data: CustomerManagementListDetails;
}

// Customer Management Details List End
