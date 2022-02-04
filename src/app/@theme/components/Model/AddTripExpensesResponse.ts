export interface AddTripExpensesResponse {
    status: boolean;
    message: string;
    data: Data;
  }
  export interface Data {
    trip_expense_id: string;
    trip_id: string;
    expense_type: string;
    expense_date: string;
    expense_notes: string;
    amount: string;
    receipt_image: string;
    added_date: string;
    modified_date: string;
    status: string;
  }
  