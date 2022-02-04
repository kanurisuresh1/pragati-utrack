import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UtrackService } from '../../../../@theme/components/Services/Utrack.service';
import { ServiceManagementData } from '../../../../@theme/components/Model/ServiceManagementResponse';

@Component({
  selector: 'ngx-view-service-image',
  templateUrl: './view-service-image.component.html',
  styleUrls: ['./view-service-image.component.scss']
})
export class ViewServiceImageComponent implements OnInit {
  private serviceData: ServiceManagementData;
  fileImage: string;

  constructor(@Inject(MAT_DIALOG_DATA) serviceManagementDetails: ServiceManagementData,
    private uTrackService: UtrackService,
  ) {
    if (serviceManagementDetails != null)
      this.serviceData = JSON.parse(serviceManagementDetails.vehicle_service_id)
    this.fileImage = this.serviceData.report_file;
  }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
  }

}
