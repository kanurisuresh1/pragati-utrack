export interface ContactUsRespones {
  status: boolean;
  message: string;
  data?: ContactUsRespones[] ;
}

export interface ContactUsRespones {
  user_id: string;
  subject: string;
  description: string;
}
