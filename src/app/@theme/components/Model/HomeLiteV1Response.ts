export interface HomeLiteV1Response {
  status: boolean;
  message: string;
  data: HomeLiteV1Data[];
}
export interface HomeLiteV1Data {
  device_link_id: string;
  device_id: string;
  device_imei: string;
  vehicle_number: string;
  devicetime: string;
  vehicle_type: string;
  product_type: string;
}
