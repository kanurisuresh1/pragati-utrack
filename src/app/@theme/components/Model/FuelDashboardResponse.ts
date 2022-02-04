export interface FuelDashboardResponse {
    status: boolean;
    message: string;
    data: CustomFuelDashboardResponseData ;
  }
  export interface CustomFuelDashboardResponseData {
    device_link_id: string;
    vehicle_number: string;
    device_id: string;
    vehicle_type: string;
    total_km: string;
    total_fuel_consumed: string;
    average_mileage: string;
    refills_count: string;
    refills_liters: string;
    theft_count: string;
    theft_liters: string;
    start_fuel: string;
    end_fuel: string;
    report_day: string;
    total_amount_spent_on_fuel: string;
    total_amount_loss_due_to_theft: string;
    start_date :string;
    end_date :string;
    detail?:  FuelDashboardResponseData [];
  }
  export interface FuelDashboardResponseData {
    vehicle_fuel_summary_id: string;
    device_link_id: string;
    total_km: string;
    total_fuel_consumed: string;
    average_mileage: string;
    refills_count: string;
    refills_liters: string;
    theft_count: string;
    theft_liters: string;
    report_date: string;
    start_fuel: string;
    end_fuel: string;
    rate_of_fuel_per_liter: string;
    report_day: string;
    vehicle_number: string;
    device_id: string;
    vehicle_type: string;
    total_amount_spent_on_fuel: string;
    total_amount_loss_due_to_theft: string;
  }
  