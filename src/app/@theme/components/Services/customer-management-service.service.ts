import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { CustomerManagementDetails, Customers } from '../Model/CustomerManagementDetails';

@Injectable({
  providedIn: 'root'
})
export class CustomerManagementServiceService {

  constructor(private http : HttpClient) { }

  getCustomerManagementDetails(){
  
      const headers = {
        'X-Api-Key': environment.X_API_KEY,
      }
      return this.http.get<Customers>(environment.apiBaseUrl + 'customer_list?user_id=1&user_type=Customer&device_token=Web',{ headers })
    }
  }

