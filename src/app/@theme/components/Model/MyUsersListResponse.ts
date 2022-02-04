export interface MyUsersListResponse {
    status: boolean;
    message: string;
    data?: MyUsersListResponseData[] ;
  }
  export interface MyUsersListResponseData {
    user_id: string;
    first_name: string;
    last_name: string;
    nick_name: string;
    mobile: string;
    profile_image: string;
    user_friend_id: string;
    type: string;
    dl_front: string;
    dl_back: string;
    joining_date: string;
    birth_date: string;
    pan_id: string;
    driving_licence_id: string;
    gender: string;
    p_front: string;
    blood_group: string;
    status: string;
    state_id: string;
    district_id: string;
    city_id: string;
    area: string;
    pincode: string;
    landmark: string;
    address: string;
    state?: null;
    district_name?: null;
    city?: null;
    device_list?: (DeviceListEntity)[] | null;
    driver_vehicle_list?: (DriverVehicleListEntity)[] | null;
    trip_count: number;
  }
  export interface DeviceListEntity {
    device_link_id: string;
    vehicle_image: string;
    vehicle_number: string;
    user_device_trans_id: string;
    vehicle_type: string;
    product_type: string;
  }
  export interface DriverVehicleListEntity {
    device_link_id: string;
    vehicle_image: string;
    vehicle_number: string;
    vehicle_detail_id: string;
  }
  