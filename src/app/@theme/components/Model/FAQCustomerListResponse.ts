export interface FAQCustomerListResponse {
    status: boolean;
    message: string;
    data?: FAQCustomerListResponseData[];
  }
  export interface FAQCustomerListResponseData {
    faq_id: string;
    question: string;
    answer: string;
    order_by: string;
    status: string;
  }
  