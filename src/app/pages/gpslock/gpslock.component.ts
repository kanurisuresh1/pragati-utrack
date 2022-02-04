import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { HeaderInteractorService } from '../../@theme/components/Services/header-interactor.service';
import { UtrackService } from '../../@theme/components/Services/Utrack.service';
import { DatePipe, DOCUMENT, Location } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { HomeData } from '../../@theme/components/Model/Home';
//excel import paclage
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { ThemePalette } from '@angular/material/core';
import { Base64ImageConstants } from '../../@theme/components/Services/image_constants';
import { DateUtils } from '../../@theme/components/Services/date_utils';
import { PdfUtils } from '../../@theme/components/Services/pdf_utils';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { OpenDetailsComponent } from '../dashboard/open-details/open-details.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'ngx-gpslock',
  templateUrl: './gpslock.component.html',
  styleUrls: ['./gpslock.component.scss']
})

export class GPSLockComponent implements OnInit {
  color: ThemePalette = 'accent';
  HOME_DATA: HomeData[] = [];

  displayedColumns: string[] = ['id', 'vehicle_number', 'vehicle_type', 'speed', 'last_location', 'fixtime', 'Assigned'];
  gpslockdata = new MatTableDataSource<HomeData>(this.HOME_DATA)
  GpsLockMessage: string;
  deviceLinkId: any;
  vehicleNumber: any;
  lockOtp: any;
  unlockOtp: any;
  lockOtp_verify_code: number;
  unlockOtp_verify_code: number;
  TableDataNotshow: boolean;

  constructor(private headerService: HeaderInteractorService,
    private uTrackService: UtrackService,
    private location: Location,
    private modalService: NgbModal,
    private toasterService: NbToastrService,
    private dialog: MatDialog,

  ) {

  }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    this.headerService.updateHeaderTitle('HEADER_NAMES.GPS Lock')
    this.getVehicles();
  }

  private filterValue = "";


  config = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '-',
    inputStyles: {
      'width': '50px',
      'height': '50px',
      'color': 'blue',
      'background-color': 'white'
    }
  };

  applyFilter(event: KeyboardEvent) {
    if (event.key == "Enter") {
      this.filterValue = (event.target as HTMLInputElement).value;
      this.filterValue = this.filterValue.trim(); // Remove whitespace
      this.gpslockdata.filter = this.filterValue;
      this.getVehicles();
    }
  }

  search() {
    this.filterValue = this.filterValue.trim(); // Remove whitespace
    this.filterValue = (document.getElementById('search_element') as HTMLInputElement).value;
    this.gpslockdata.filter = this.filterValue;
    this.getVehicles();
  }

  refresh() {
    this.getVehicles();
  }

  getVehicles() {
    this.uTrackService.getHomeWebService().subscribe(response => {

      if (response.status) {
        if (response.data != null && response.data != undefined && response.data.length > 0) {
          this.TableDataNotshow = false;
          this.HOME_DATA = [];
          response.data.forEach(row => {
            if (row.with_realm == "Yes") {
              this.HOME_DATA.push(row)
              row.checked = (row.gps_lock_status == 1)
              if (row.last_loc_distance != undefined && row.last_loc_distance != ""
                && row.last_loc_distance != null && Number(row.last_loc_distance) > 0) {
                row.location_formatted = row.last_loc_distance + ' KM From ' + row.last_location
              } else {
                row.location_formatted = ' - '
              }

              row.speed_formatted = (Number(row.speed) * 2).toFixed(0)

              var imageIdCardRed = "assets/images/map_icons/marker_type_red_id.png";
              var imageIdCardGreen = "assets/images/map_icons/marker_type_green_id.png";
              var imageIdCardYellow = "assets/images/map_icons/marker_type_yellow_id.png";

              var imageMobileRed = "assets/images/map_icons/marker_type_red_mobile.png";
              var imageMobileGreen = "assets/images/map_icons/marker_type_green_mobile.png";
              var imageMobileYellow = "assets/images/map_icons/marker_type_yellow_mobile.png";

              var listimageCarRed = "assets/images/data_list_icons/marker_type_red_car.png";
              var listimageCarGreen = "assets/images/data_list_icons/marker_type_green_car.png";
              var listimageCarYellow = "assets/images/data_list_icons/marker_type_yellow_car.png";

              var listimageBusRed = "assets/images/data_list_icons/marker_type_red_bus.png";
              var listimageBusGreen = "assets/images/data_list_icons/marker_type_green_bus.png";
              var listimageBusYellow = "assets/images/data_list_icons/marker_type_yellow_bus.png";

              var listimageTruckRed = "assets/images/data_list_icons/marker_type_red_truck.png";
              var listimageTruckGreen = "assets/images/data_list_icons/marker_type_green_truck.png";
              var listimageTruckYellow = "assets/images/data_list_icons/marker_type_yellow_truck.png";

              var listimageAutoRed = "assets/images/data_list_icons/marker_type_red_auto.png";
              var listimageAutoGreen = "assets/images/data_list_icons/marker_type_green_auto.png";
              var listimageAutoYellow = "assets/images/data_list_icons/marker_type_yellow_auto.png";

              var listimageBikeRed = "assets/images/data_list_icons/marker_type_red_bike.png";
              var listimageBikeGreen = "assets/images/data_list_icons/marker_type_green_bike.png";
              var listimageBikeYellow = "assets/images/data_list_icons/marker_type_yellow_bike.png";

              var listimageMobileRed = "assets/images/data_list_icons/marker_type_red_mobile.png";
              var listimageMobileGreen = "assets/assets/images/data_list_icons/marker_type_green_mobile.png";
              var listimageMobileYellow = "assets/images/data_list_icons/marker_type_yellow_mobile.png";

              var listimageIdCardRed = "assets/images/data_list_icons/marker_type_red_id.png";
              var listimageIdCardGreen = "assets/images/data_list_icons/marker_type_green_id.png";
              var listimageIdCardYellow = "assets/images/data_list_icons/marker_type_yellow_id.png";

              var listimageScootyRed = "assets/images/data_list_icons/marker_type_scooty_red.png";
              var listimageScootyGreen = "assets/images/data_list_icons/marker_type_scooty_green.png";
              var listimageScootyYellow = "assets/images/data_list_icons/marker_type_scooty_yellow.png";

              var listimageTrainRed = "assets/images/data_list_icons/marker_type_train_red.png";
              var listimageTrainGreen = "assets/images/data_list_icons/marker_type_train_green.png";
              var listimageTrainYellow = "assets/images/data_list_icons/marker_type_train_yellow.png";

              if (row.speed && row.devicetime && row.fixtime &&
                ((new Date()).getTime() - (new Date(row.devicetime)).getTime()) < 7200000) {

                if (Number(row.speed) > 0) {

                  switch (row.vehicle_type) {
                    case "Car":
                      row.vehicle_motion_status_color = '#62760c'
                      row.listimage = listimageCarGreen;
                      break;
                    case "Bus":
                      row.vehicle_motion_status_color = '#62760c'
                      row.listimage = listimageBusGreen;
                      break;
                    case "Truck":
                      row.vehicle_motion_status_color = '#62760c'
                      row.listimage = listimageTruckGreen;
                      break;
                    case "Auto":
                      row.vehicle_motion_status_color = '#62760c'
                      row.listimage = listimageAutoGreen;
                      break;
                    case "Bike":
                      row.vehicle_motion_status_color = '#62760c'
                      row.listimage = listimageBikeGreen;
                      break;
                    case "Mobile":
                      row.vehicle_motion_status_color = '#62760c'
                      row.listimage = listimageMobileGreen;
                      break;
                    case "IdCard":
                      row.vehicle_motion_status_color = '#62760c'
                      row.listimage = listimageIdCardGreen;
                      break;
                    case "Scooty":
                      row.vehicle_motion_status_color = '#62760c'
                      row.listimage = listimageScootyGreen;
                      break;
                    case "Train":
                      row.vehicle_motion_status_color = '#62760c'
                      row.listimage = listimageTrainGreen;
                      break;
                  }
                } else if (Number(row.speed) == 0) {

                  switch (row.vehicle_type) {
                    case "Car":
                      row.vehicle_motion_status_color = '#ec0101'
                      row.listimage = listimageCarRed;
                      break;
                    case "Bus":
                      row.vehicle_motion_status_color = '#ec0101'
                      row.listimage = listimageBusRed;
                      break;
                    case "Truck":
                      row.vehicle_motion_status_color = '#ec0101'
                      row.listimage = listimageTruckRed;
                      break;
                    case "Auto":
                      row.vehicle_motion_status_color = '#ec0101'
                      row.listimage = listimageAutoRed;
                      break;
                    case "Bike":
                      row.vehicle_motion_status_color = '#ec0101'
                      row.listimage = listimageBikeRed;
                      break;
                    case "Mobile":
                      row.vehicle_motion_status_color = '#ec0101'
                      row.listimage = listimageMobileRed;
                      break;
                    case "IDCard":
                      row.vehicle_motion_status_color = '#ec0101'
                      row.listimage = listimageIdCardRed;
                      break;
                    case "Scooty":
                      row.vehicle_motion_status_color = '#ec0101'
                      row.listimage = listimageScootyRed;
                      break;
                    case "Train":
                      row.vehicle_motion_status_color = '#ec0101'
                      row.listimage = listimageTrainRed;
                      break;
                  }
                }
              } else {
                switch (row.vehicle_type) {
                  case "Car":
                    row.vehicle_motion_status_color = '#f3c623'
                    row.listimage = listimageCarYellow;
                    break;
                  case "Bus":
                    row.vehicle_motion_status_color = '#f3c623'
                    row.listimage = listimageBusYellow;
                    break;
                  case "Truck":
                    row.vehicle_motion_status_color = '#f3c623'
                    row.listimage = listimageTruckYellow;
                    break;
                  case "Auto":
                    row.vehicle_motion_status_color = '#f3c623'
                    row.listimage = listimageAutoYellow;
                    break;
                  case "Bike":
                    row.vehicle_motion_status_color = '#f3c623'
                    row.listimage = listimageBikeYellow;
                    break;
                  case "Mobile":
                    row.vehicle_motion_status_color = '#f3c623'
                    row.listimage = listimageMobileYellow;
                    break;
                  case "IDCard":
                    row.vehicle_motion_status_color = '#f3c623'
                    row.listimage = listimageIdCardYellow;
                    break;
                  case "Scooty":
                    row.vehicle_motion_status_color = '#f3c623'
                    row.listimage = listimageScootyYellow;
                    break;
                  case "Train":
                    row.vehicle_motion_status_color = '#f3c623'
                    row.listimage = listimageTrainYellow;
                    break;
                }
              }
            }
          })

          this.gpslockdata.data = this.HOME_DATA;

        } else {
          this.TableDataNotshow = true;
        }
      } else {
        this.TableDataNotshow = true;
      }

      if (this.HOME_DATA.length > 0) {
        this.TableDataNotshow = false;
      } else {
        this.TableDataNotshow = true;
      }

    })
  }


  isShowTitle: boolean
  isShowUnlockTitle: boolean

  GpsLock(event, OpenGpsOtpModal, device_link_id, vehicle_number) {
    this.deviceLinkId = device_link_id
    this.vehicleNumber = vehicle_number

    if (event.checked == true) {
      this.modalService.open(OpenGpsOtpModal);
      this.isShowTitle = true
      this.isShowUnlockTitle = false
    }
    if (event.checked == false) {
      this.modalService.open(OpenGpsOtpModal);
      this.isShowTitle = false
      this.isShowUnlockTitle = true
    }
  }

  openDetails(model_data: HomeData) {
    const rowData = JSON.stringify(model_data);

    const dialogReference = this.dialog.open(OpenDetailsComponent, {
      disableClose: true,
      data: { vehicle_number: rowData },
    });
    dialogReference.afterClosed().subscribe(() => {
      dialogReference.close();
    });
  }

  gpsLockApiCall(OpenGpsLockedkModal) {
    this.modalService.dismissAll('Closed');
    const GpsLockStatusActive = '1'
    const formData = new FormData();

    formData.append('user_id', localStorage.getItem("USER_ID"));
    formData.append('user_type', localStorage.getItem("USER_TYPE"));
    formData.append('device_link_id', this.deviceLinkId);
    formData.append('status', GpsLockStatusActive)
    formData.append('device_token', "Web");

    this.uTrackService.gps_lock_verify_otp(formData).subscribe(response => {
      if (response.status) {
        this.lockOtp_verify_code = response.data.verify_code
        this.GpsLockMessage = response.message
        this.toasterService.success(response.message, '')
        this.openOtpModel(OpenGpsLockedkModal)
      } else {
        this.toasterService.danger(response.message, '')
      }
    })
  }

  openOtpModel(OpenGpsLockedkModal) {
    this.modalService.open(OpenGpsLockedkModal);
  }

  gpsUnLockApiCall(OpenGpsUnLockedkModal) {
    this.modalService.dismissAll('Closed');
    const GpsLockStatusUnactive = '0'
    const formData = new FormData();

    formData.append('user_id', localStorage.getItem("USER_ID"));
    formData.append('user_type', localStorage.getItem("USER_TYPE"));
    formData.append('device_link_id', this.deviceLinkId);
    formData.append('status', GpsLockStatusUnactive)
    formData.append('device_token', "Web");

    this.uTrackService.gps_lock_verify_otp(formData).subscribe(response => {
      if (response.status) {
        this.unlockOtp_verify_code = response.data.verify_code
        this.GpsLockMessage = response.message
        this.toasterService.success(response.message, '')
        this.openUnlockOtpModel(OpenGpsUnLockedkModal)
      } else {
        this.toasterService.danger(response.message, '')
      }
    })
  }

  openUnlockOtpModel(OpenGpsUnLockedkModal) {
    this.modalService.open(OpenGpsUnLockedkModal);
  }

  cancelGpsLockButton() {
    this.modalService.dismissAll('Closed');
    this.getVehicles();
  }

  otp: string;

  onLockOtpChange(otp) {
    this.lockOtp = otp;
  }

  onUnlockOtpChange(otp) {
    this.unlockOtp = otp
  }


  gpsLockChangeStatus() {
    if (this.lockOtp_verify_code == this.lockOtp) {
      const GpsLockStatus = '1'
      const formData = new FormData();
      formData.append('user_id', localStorage.getItem('USER_ID'));
      formData.append('status', GpsLockStatus);
      formData.append('device_token', "Web");
      formData.append('device_link_id', this.deviceLinkId);
      this.uTrackService.gps_lock_status_change(formData).subscribe(response => {
        if (response.status) {
          this.toasterService.success('', response.message)
          this.modalService.dismissAll('Closed');
          this.getVehicles();
        }
      })
    } else {
      this.toasterService.danger('OTP Verification Code does not match')
    }

  }

  gpsUnLockChangeStatus() {
    if (this.unlockOtp_verify_code == this.unlockOtp) {
      const GpsUnLockStatus = '0'
      const formData = new FormData();
      formData.append('user_id', localStorage.getItem('USER_ID'));
      formData.append('status', GpsUnLockStatus);
      formData.append('device_token', "Web");
      formData.append('device_link_id', this.deviceLinkId);
      this.uTrackService.gps_lock_status_change(formData).subscribe(response => {
        if (response.status) {
          this.toasterService.success('', response.message)
          this.modalService.dismissAll('Closed');
          this.getVehicles();
        }
      })
    } else {
      this.toasterService.danger('OTP Verification Code does not match')
    }
  }

  back() {
    this.location.back()
  }

  downloadPDF() {
    var converted_reportdate = DateUtils.getDisplayTodayDateTime();
    var myText = 'UTrack Gps Lock Details  \n  Report generated on '
    var pdf_heading_text = myText.concat(converted_reportdate)
    let customerTableColumn: string[] = ['ID', 'Vehicle Name', 'Vehicle Type', 'Speed(KMPH)', 'Location', 'Last Record(D&T)'];
    let data: String[][] = [];

    let i = 1;
    for (let value of this.HOME_DATA) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(value.vehicle_number);
      row.push(value.vehicle_type);
      row.push(value.speed_formatted);
      row.push(value.location_formatted);
      row.push(DateUtils.getDisplayDateTime(value.fixtime));
      data.push(row);
      i++;
    }
    PdfUtils.downloadPdf(pdf_heading_text, customerTableColumn, data, 'GpsLockDetails');
  }

  exportexcle() {
    let columns = ['ID', 'Vehicle Name', 'Vehicle Type', 'Speed(KMPH)', 'Location', 'Last Record(D&T)'];
    const converted_reportdate = DateUtils.getDisplayTodayDateTime();
    //Create a workbook with a worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Utrack');
    // Add Image
    const myLogoImage = workbook.addImage({
      base64: Base64ImageConstants.uTrackLogoWithBG,
      extension: 'png',
    });
    const ramkiLogo = workbook.addImage({
      base64: Base64ImageConstants.ramkiLogo,
      extension: 'png',
    });
    worksheet.mergeCells('A1:B3');
    worksheet.addImage(myLogoImage, 'A1:B3');
    worksheet.mergeCells('F1:F3');
    worksheet.addImage(ramkiLogo, 'F1:F3');
    //Add Row and formatting
    worksheet.mergeCells('C1', 'E2');
    let titleRow = worksheet.getCell('C1');
    titleRow.value = 'UTrack Gps Lock Details '
    titleRow.font = {
      name: 'Calibri',
      size: 18,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' }
    }
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' }
    worksheet.mergeCells('C3', 'E3');
    let startToendData = worksheet.getCell('C3');
    startToendData.value = 'Report generated on' + '  ' + converted_reportdate
    startToendData.font = {
      name: 'Calibri',
      size: 18,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' }
    }
    startToendData.alignment = { vertical: 'middle', horizontal: 'center' }
    worksheet.addRow([]);
    //Adding Header Row
    let headerRow = worksheet.addRow(columns);
    headerRow.eachCell((cell, index) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4167B8' },
        bgColor: { argb: '' }
      }
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' },
        size: 14
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin', }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    })
    // Adding Data with Conditional Formatting
    let i = 1;
    for (let value of this.HOME_DATA) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(value.vehicle_number);
      row.push(value.vehicle_type);
      row.push(value.speed_formatted);
      row.push(value.location_formatted);
      row.push(DateUtils.getDisplayDateTime(value.fixtime));
      worksheet.addRow(row);
      i++;
    }
    worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 22;
    worksheet.getColumn(3).width = 23;
    worksheet.getColumn(4).width = 16;
    worksheet.getColumn(5).width = 100;
    worksheet.getColumn(6).width = 23;
    worksheet.addRow([]);

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'GpsLockDetails' + '.xlsx');
    })
  }
}
