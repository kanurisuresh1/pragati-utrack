export interface NotificationResponse {
    status: boolean;
    message: string;
    data?: NotificationResponseData[];
}
export interface NotificationResponseData {
    notificationTime: string;
    notificatindate: string;
    user_notification_id: string;
    user_id: string;
    page_index: any;
    notify_type: string;
    message: string;
    added_date: string;
    statu: string;
    read_status: string;
}
