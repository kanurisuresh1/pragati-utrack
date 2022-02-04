import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GetVehicleDetailsData, VehicleImageList } from '../../../../@theme/components/Model/GetVehicleNumberDetails';
import { UtrackService } from '../../../../@theme/components/Services/Utrack.service';

@Component({
  selector: 'ngx-showvehicle-image',
  templateUrl: './showvehicle-image.component.html',
  styleUrls: ['./showvehicle-image.component.scss']
})
export class ShowvehicleImageComponent implements OnInit {

  vehicleImageDetailsData: VehicleImageList
  fileImage: any
  constructor(private uTrackService: UtrackService, @Inject(MAT_DIALOG_DATA) vehicleDetails: VehicleImageList,
  ) {
    if (vehicleDetails != null)
      this.vehicleImageDetailsData = JSON.parse(vehicleDetails.image_file)
    this.fileImage = this.vehicleImageDetailsData.image_file
  }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
  }

}
