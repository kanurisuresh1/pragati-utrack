export interface PurchasedPlanHistoryResponse {
    status: boolean;
    message: string;
    data?: PurchasedPlanHistoryData[] ;
  }
  export interface PurchasedPlanHistoryData {
    plan_name: string;
    plan_status: string;
    plan_cost: string;
    plan_validity: string;
    short_description: string;
    plan_payment_transaction_id: string;
    user_id: string;
    plan_id: string;
    device_link_ids: string;
    plan_amount: string;
    online_amount: string;
    wallet_amount: string;
    total_amount: string;
    total_device: string;
    payment_type: string;
    user_wallet_trans_id: string;
    payment_txn_id: string;
    transaction_response: string;
    payment_date: string;
    payment_status: string;
    device_info?: (DeviceInfoEntity)[] | null;
  }
  export interface DeviceInfoEntity {
    device_link_id: string;
    imei: string;
    vehicle_number: string;
    secondry_customer_name: string;
  }
  