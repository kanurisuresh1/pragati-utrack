export interface BuyPlansResponse {
    status: boolean;
    message: string;
    data?: BuyPlansResponseData[] ;
  }
  export interface BuyPlansResponseData {
    plan_id: string;
    plan_name: string;
    plan_code: string;
    plan_validity: string;
    short_description: string;
    plan_description: string;
    plan_cost: string;
    order_by: string;
    added_date: string;
    modified_date: string;
    plan_status: string;
  }
  