
    export interface DeviceList {
        device_link_id: string;
        vehicle_image: string;
        vehicle_number: string;
        user_device_trans_id: string;
        vehicle_type: string;
        product_type: string;
    }

    export interface DriverVehicleList {
        device_link_id: string;
        vehicle_image: string;
        vehicle_number: string;
        vehicle_detail_id: string;
    }

    export interface MyUsersListDetails {
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
        state: string;
        district_name: string;
        city: string;
        device_list: DeviceList[];
        driver_vehicle_list: DriverVehicleList[];
        trip_count: number;
    }

    export interface MyUsersList {
        status: boolean;
        message: string;
        data: MyUsersListDetails[];
    }



