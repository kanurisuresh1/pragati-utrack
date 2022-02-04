export interface MyOrderListRespones {
    status: boolean;
    message: string;
    data?: MyOrderListResponesData[] ;
  }
  export interface MyOrderListResponesData {
    order_id: string;
    order_code: string;
    order_date: string;
    payment_date: string;
    total_amount: string;
    payment_status: string;
    order_status: string;
    product_count: string;
  }
  