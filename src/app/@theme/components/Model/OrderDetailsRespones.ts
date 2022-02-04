export interface OrderDetailsRespones {
    status: boolean;
    message: string;
    data: OrderDetailsResponesData;
  }
  export interface OrderDetailsResponesData {
    order_id: string;
    user_id: string;
    order_code: string;
    gross_amount: string;
    tax_amount: string;
    shipping_amount: string;
    discount_amount: string;
    dicount_type: string;
    discount_value: string;
    total_amount: string;
    refund_amount: string;
    payment_type: string;
    online_amount: string;
    wallet_amount: string;
    user_wallet_trans_id: string;
    payment_txn_id: string;
    transaction_response: string;
    address: string;
    address_name: string;
    address_landmark: string;
    city_id: string;
    district_id: string;
    state_id: string;
    country_id: string;
    pincode: string;
    mobile: string;
    payment_status: string;
    order_status: string;
    courier_name?: null;
    courier_tracking_no?: null;
    courier_status?: null;
    payment_date: string;
    order_date: string;
    modified_date: string;
    shipped_date?: null;
    delivered_date?: null;
    returned_date?: null;
    return_reason?: null;
    cancelled_date?: null;
    refund_txn_id: string;
    coupon_id: string;
    coupon_code: string;
    order_product_list?: (null)[] | null;
  }
  