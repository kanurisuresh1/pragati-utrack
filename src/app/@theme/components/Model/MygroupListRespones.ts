export interface MygroupListResponse {
  status: boolean;
  message: string;
  data?: MygroupListResponseData[];
}
export interface MygroupListResponseData {
  groupImagePath: string;
  groupTotaldeviceListId: number;
  group_id: string;
  user_id: string;
  group_name: string;
  group_icon_name: string;
  added_date: string;
  modified_date?: null;
  status: string;
  device_link_id_list?: DeviceLinkIdListEntity[];

  // Dashboard Usage
  position: string;

}
export interface DeviceLinkIdListEntity {
  device_link_id: string;
}
