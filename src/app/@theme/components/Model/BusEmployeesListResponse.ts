export interface BusEmployeesListResponse {
    status: boolean
    message: string
    data: BusEmployeesListResponseData[]
}

export interface BusEmployeesListResponseData {
    user_id: string
    first_name: string
    last_name: string
    nick_name: string
    mobile: string
    email: string
    profile_image: string
    user_friend_id: string
    friend_type: string
    dl_front: string
    dl_back: string
    joining_date: any
    birth_date: any
    pan_id: any
    driving_licence_id: any
    gender: any
    p_front: string
    blood_group: any
    status: string
    state_id: string
    district_id: string
    city_id: string
    area: any
    pincode: any
    landmark: any
    address: any
    state: string
    district_name: string
    city: string
    org_name: string
    branch_name: string
    bus_organisation_role: string;
}
