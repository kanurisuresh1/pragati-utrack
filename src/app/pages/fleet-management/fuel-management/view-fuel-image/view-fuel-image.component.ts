import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FuelManagementDetails } from '../../../../@theme/components/Model/FuelManagementResponse';
import { UtrackService } from '../../../../@theme/components/Services/Utrack.service';

@Component({
  selector: 'ngx-view-fuel-image',
  templateUrl: './view-fuel-image.component.html',
  styleUrls: ['./view-fuel-image.component.scss']
})
export class ViewFuelImageComponent implements OnInit {
  private fuelData: FuelManagementDetails;
  fileImage: any

  constructor(@Inject(MAT_DIALOG_DATA) fuelManagementDetails: FuelManagementDetails,
    private uTrackService: UtrackService,
  ) {
    if (fuelManagementDetails != null)
      this.fuelData = JSON.parse(fuelManagementDetails.vehicle_fuel_id)
    this.fileImage = this.fuelData.bill_image
  }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
  }

}
