export interface EmergenceCustomerDetailsResponse {
    status: boolean
    message: string
    data: EmergenceCustomerDetailsResponseData[]
}

export interface EmergenceCustomerDetailsResponseData {
    device_link_id: string
    device_id: string
    device_imei: string
    status: string
    executive_sold_date: string
    dealer_sold_date: any
    payment_status: string
    payment_type: string
    gps_lock_status: string
    vehicle_number: string
    vehicle_name: string
    latitude: string
    longitude: string
    course: string
    speed: string
    attributes: string
    valid: string
    fixtime: string
    devicetime: string
    servertime: string
    last_running_time: string
    last_location: string
    last_loc_distance: string
    sim_serial_no: string
    sim_imei_no: string
    sim_operator_name: string
    sim_buy_date: string
    sim_last_recharge_date: string
    activation_date: string
    expiry_date: string
    vehicle_type: string
    vehicle_type_image: string
    seller_name: string
    seller_type: string
    customer_name: string
    customer_image: string
    customer_mobile: string
    sec_customer_name: string
    sec_customer_image: string
    sec_customer_mobile: string
    product_type: string
    emergency_contact_1: string
    emergency_contact_2: string
    emergency_contact_3: string
    ec_name_1: string
    ec_name_2: string
    ec_name_3: string
    ec_sms_num_1: string
    ec_sms_num_2: string
    ec_sms_num_3: string
    driver_name: any
    driver_image: string
    driver_mobile: any
    nick_name: any
    position_id: string
    ignition: boolean
    motion_status: boolean
    plan_list: PlanList[]
    vehicle_driver_history: any[]
    user_group_list: any[]
    asset_change_history: AssetChangeHistory[]
}

export interface PlanList {
    plan_subscription_id: string
    device_link_id: string
    plan_id: string
    start_date: string
    end_date: string
    plan_amount: string
    plan_payment_transaction_id: string
    purchased_date: string
    purchased_by_id: string
    plan_status: string
    plan_name: string
}

export interface AssetChangeHistory {
    asset_change_history_id: string
    device_link_id: string
    old_vehicle_number: string
    new_vehicle_number: string
    old_vehicle_name: string
    new_vehicle_name: string
    added_date: string
}
