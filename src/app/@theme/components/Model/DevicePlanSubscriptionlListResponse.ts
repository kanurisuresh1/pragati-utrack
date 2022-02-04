export interface DevicePlanSubscriptionlListResponse {
    status: boolean;
    message: string;
    data?: DevicePlanSubscriptionlListResponseData[] ;
  }
  export interface DevicePlanSubscriptionlListResponseData {
    plan_subscription_id: string;
    device_link_id: string;
    plan_id: string;
    start_date: string;
    end_date: string;
    plan_amount: string;
    plan_payment_transaction_id: string;
    purchased_date: string;
    purchased_by_id: string;
    plan_status: string;
    plan_name: string;
    imei: string;
    vehicle_number: string;
    vehicle_type: string;
    purchased_by_name: string;
  }
  