export interface BuyProductsResponse {
    status: boolean;
    message: string;
    data?: BuyProductsResponseData[];
  }
  export interface BuyProductsResponseData {
    product_id: string;
    product_name: string;
    model: string;
    image: string;
    description: string;
    price: string;
    added_date: string;
    updated_date?: null;
    status: string;
    product_type: string;
    description_text: string;
    is_corporate: string;
  }
  