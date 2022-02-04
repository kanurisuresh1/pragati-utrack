export interface Home_V2 {
    status: boolean
    message: string
    data: Home_V2_Data[]
  }
  
  export interface Home_V2_Data {
    device_link_id: string
    device_id: string
    device_imei: string
    gps_lock_status: string
    vehicle_number: string
    vehicle_name: string
    with_realm: string
    expiry_date: string
    vehicle_type: string
    fuel_tank_size: any
    batteryLevel: string
    customer_id: string
    customer_name: string
    customer_image: string
    customer_mobile: string
    product_type: string
    vehicle_image: string
    driver_id: string
    nick_name: string
    driver_name: string
    driver_mobile: string
    latitude: string
    longitude: string
    course: string
    speed: string
    servertime: string
    devicetime: string
    fixtime: string
    day_distance: string
    last_running_time: string
    power_status: string
    last_area: string
    last_district: string
    last_city: string
    last_state: string
    last_state_id: string
    landmark: string
    dtime: string
    ignition: boolean
    motion_status: boolean
    lrt: string
    vehicle_motion_status: number
    vehicle_motion_status_color: string
    vehicle_motion_status_image:string
    MonthDatelistimage:string
    fuel_point: string
    temp1: string
    device_user_list_count: number
    inprogress_trip: any[]
  }
  