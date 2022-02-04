import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { VechicleDetails } from '../../../@theme/components/Model/GetAllVechiclesDetails';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';
import { HeaderInteractorService } from '../../../@theme/components/Services/header-interactor.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location} from '@angular/common';
import 'jspdf-autotable';
//excel import paclage
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { PdfUtils } from '../../../@theme/components/Services/pdf_utils';
import { DateUtils } from '../../../@theme/components/Services/date_utils';
import { Base64ImageConstants } from '../../../@theme/components/Services/image_constants';

@Component({
  selector: 'ngx-vechicles-details',
  templateUrl: './vechicles-details.component.html',
  styleUrls: ['./vechicles-details.component.scss']
})
export class VechiclesDetailsComponent implements OnInit {

  TableDataNotshow: boolean;
  ELEMENT_DATA: VechicleDetails[] = [];

  dataSource = new MatTableDataSource<VechicleDetails>(this.ELEMENT_DATA)

  displayedColumnsObj = [
    { "value": 'id', "show": true },
    { "value": 'vehicle number', "show": true },
    { "value": 'engine number', "show": true },
    { "value": 'chassis number', "show": true },
    { "value": 'make', "show": true },
    { "value": 'model', "show": true },
    { "value": 'min temp', "show": true },
    { "value": 'max temp', "show": true },
    { "value": 'fuel type', "show": true },
    { "value": 'fuel tank size', "show": true },
    { "value": 'over speed', "show": true },
    { "value": 'mileage per litre', "show": true },
    { "value": 'buy date', "show": true },
    { "value": 'hub name', "show": true },
    { "value": 'driver name', "show": true },
    { "value": 'driver mobile', "show": true },
    { "value": 'VehicleRegistrationDate', "show": true },
    { "value": 'RegisteredOwnerName', "show": true },
    { "value": 'InsuranceVendorName', "show": true },
    { "value": 'InsuranceDetails', "show": true },
    { "value": 'InsuranceCost', "show": true },
    { "value": 'InsuranceDate', "show": true },
    { "value": 'PollutionCost', "show": true },
    { "value": 'PollutionCheckDate', "show": true },
    { "value": 'PollutionRenewalDate', "show": true },
    { "value": 'NationalPermitId', "show": true },
    { "value": 'NationalPermitIssueDate', "show": true },
    { "value": 'NationalPermitIssueDate', "show": true },
    { "value": 'NationalPermitRenewalDate', "show": true },
    { "value": 'StateName', "show": true },
    { "value": 'StatePermitId', "show": true },
    { "value": 'StatePermitIssueDate', "show": true },
    { "value": 'StatePermitRenewalDate', "show": true },
    { "value": 'FitnessCertificateID', "show": true },
    { "value": 'FItnessDate', "show": true },
    { "value": 'FitnessRenewalDate', "show": true },
    { "value": 'TaxID', "show": true },
    { "value": 'TaxDate', "show": true },
    { "value": 'TaxRenewalDate', "show": true },

  ]

  get displayedColumns(): string[] {
    return this.displayedColumnsObj.filter((element) => { return element.show == true }).map((element) => { return element.value });
  }

  toggle(column: string) {
    let index = this.displayedColumnsObj.map(element => element.value).indexOf(column);
    if (index >= 0) {
      this.displayedColumnsObj[index].show = !this.displayedColumnsObj[index].show;
    }
  }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("content") content: ElementRef;

  constructor(private uTrackService: UtrackService,
    private headerService: HeaderInteractorService,
    private routes: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
  ) {
 
  }
  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    this.headerService.updateHeaderTitle('HEADER_NAMES.Full Vechicle Details')
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.fetchDataFromApi()
  }
  back() {
    this.location.back();
  }

  private filterValue = "";

  applyFilter(event: KeyboardEvent) {
    if (event.key == "Enter") {
      this.filterValue = (event.target as HTMLInputElement).value;
      this.filterValue = this.filterValue.trim(); // Remove whitespace
      this.dataSource.filter = this.filterValue;
      this.dataSource.data = this.ELEMENT_DATA
    }
  }

  search() {
    this.filterValue = this.filterValue.trim(); // Remove whitespace
    this.filterValue = (document.getElementById('search_element') as HTMLInputElement).value;
    this.dataSource.filter = this.filterValue;
    this.dataSource.data = this.ELEMENT_DATA
  }

  refresh() {
    this.fetchDataFromApi()
  }

  fetchDataFromApi() {
    this.uTrackService.getAllVechiclesDetails().subscribe(response => {
      this.ELEMENT_DATA=[];
      if (response.status && response.data != null && response.data != undefined && response.data.length > 0) {
        this.TableDataNotshow = false;
        this.ELEMENT_DATA = response.data
      } else {
        this.TableDataNotshow = true;
      }
      this.dataSource.data = this.ELEMENT_DATA;
    })
  }

  downloadPDF() {
    const title1 = 'UTrack Full Vechicle Details  \n  Report generated on  ';
    const title3 = DateUtils.getDisplayTodayDate();
    const pdf_heading_date = title1.concat(title3);
    let customerTableColumn: string[] = ['ID', 'Vehicle Number', 'Engine Number', 'Chassis Number', 'Make',
      'Model', 'Min Temp', 'Max Temp', 'Fuel Type','over speed', 'Tank Capacity', 'Avg Milage', 'Buy Date', 'Hub Name', 'Driver Name', 'Driver Mobile',
      'Vehicle Registration Date', 'Registered Owner Name'];
    let data: String[][] = [];

    let i = 1;
    for (let mydata of this.ELEMENT_DATA) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(mydata.vehicle_number)
      row.push(mydata.engine_number)
      row.push(mydata.chassis_number)
      row.push(mydata.make)
      row.push(mydata.model)
      row.push(mydata.min_temp)
      row.push(mydata.max_temp)
      row.push(mydata.fuel_type)
      row.push(mydata.fuel_tank_size)
      row.push(mydata.over_speed)
      row.push(mydata.mileage_per_litre)
      row.push(DateUtils.getDisplayDate(mydata.buy_date))
      row.push(mydata.hub_name)
      row.push(mydata.driver_name)
      row.push(mydata.driver_mobile)
      row.push(mydata.vehicle_registration_date);
      row.push(mydata.registered_owner_name);
      data.push(row);
      i++;
    }
    PdfUtils.downloadPdf(pdf_heading_date, customerTableColumn, data, 'AllVechicleDetails');
  }

  editVehicleNumber(device_link_id, vehicle_number) {
    this.routes.navigate([`../vehicle-details`, device_link_id, vehicle_number],
      { relativeTo: this.activatedRoute })
  }

  epxportexcle() {
    let columns = ['ID', 'Vehicle Number', 'Engine Number', 'Chassis Number', 'Make', 'Model', 'Min Temp', 'Max Temp', 'Fuel Type', 'Tank Capacity','over speed', 'Avg Milage', 'Buy Date', 'Hub Name', 'Driver Name', 'Driver Mobile', 'Vehicle Registration Date', 'Registered Owner Name', 'Insurance Vendor Name', 'Insurance Details', 'Insurance Cost', 'Insurance Date', 'Insurance Renewal Date', 'Pollution Cost', 'Pollution Check Date', 'Pollution Renewal Date', 'National Permit Id', 'National Permit Issue Date', 'National Permit Renewal Date', 'State Name', 'State Permit Id', 'State Permit Issue Date', 'State Permit Renewal Date', 'Fitness Certificate ID', 'FItness Date', 'Fitness Renewal Date', 'Tax ID', 'Tax Date', 'Tax Renewal Date'];
    const converted_reportdate = DateUtils.getDisplayTodayDate();
    //Create a workbook with a worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Utrack');
    //Add Image
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

    worksheet.mergeCells('K1:L3');
    worksheet.addImage(ramkiLogo, 'K1:;L3');
    //Add Row and formatting
    worksheet.mergeCells('C1', 'J2');

    let titleRow = worksheet.getCell('C1');
    titleRow.value = 'UTrack Full Vechicle Details'
    titleRow.font = {
      name: 'Calibri',
      size: 18,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' }
    }
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' }

    worksheet.mergeCells('C3', 'J3');
    let startToendData = worksheet.getCell('C3');
    startToendData.value = 'Report generated on' + ' ' + converted_reportdate
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

    let i = 1;
    for (let mydata of this.ELEMENT_DATA) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(mydata.vehicle_number)
      row.push(mydata.engine_number)
      row.push(mydata.chassis_number)
      row.push(mydata.make)
      row.push(mydata.model)
      row.push(mydata.min_temp)
      row.push(mydata.max_temp)
      row.push(mydata.fuel_type)
      row.push(mydata.fuel_tank_size)
      row.push(mydata.over_speed)
      row.push(mydata.mileage_per_litre)
      row.push(DateUtils.getDisplayDate(mydata.buy_date))
      row.push(mydata.hub_name)
      row.push(mydata.driver_name)
      row.push(mydata.driver_mobile)
      row.push(mydata.vehicle_registration_date);
      row.push(mydata.registered_owner_name);
      row.push(mydata.insurance_vender_name);
      row.push(mydata.insurance_number);
      row.push(mydata.insurance_cost);
      row.push(mydata.insurance_buy_date);
      row.push(mydata.insurance_renewal_date);
      row.push(mydata.pollution_check_cost);
      row.push(mydata.pollution_check_date);
      row.push(mydata.pollution_check_renewal_date);
      row.push(mydata.national_permit_id);
      row.push(mydata.national_permit_date);
      row.push(mydata.national_permit_renewal_date);
      row.push(mydata.state_permit_name);
      row.push(mydata.state_permit_id);
      row.push(mydata.state_permit_date);
      row.push(mydata.state_permit_renewal_date);
      row.push(mydata.fitness_certificate_id);
      row.push(mydata.fitness_certificate_date);
      row.push(mydata.fitness_certificate_renewal_date);
      row.push(mydata.tax_invoice_id);
      row.push(mydata.tax_invoice_date);
      row.push(mydata.tax_invoice_renewal_date);
      worksheet.addRow(row)
      i++;
    }
    worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 21;
    worksheet.getColumn(3).width = 19;
    worksheet.getColumn(4).width = 19;
    worksheet.getColumn(5).width = 14;
    worksheet.getColumn(6).width = 12;
    worksheet.getColumn(7).width = 17;
    worksheet.getColumn(8).width = 17;
    worksheet.getColumn(9).width = 17;
    worksheet.getColumn(10).width = 30;
    worksheet.getColumn(11).width = 30;
    worksheet.getColumn(12).width = 30;
    worksheet.getColumn(13).width = 30;
    worksheet.getColumn(14).width = 30;
    worksheet.getColumn(15).width = 30;
    worksheet.getColumn(16).width = 30;
    worksheet.getColumn(17).width = 30;
    worksheet.getColumn(18).width = 30;
    worksheet.getColumn(19).width = 30;
    worksheet.getColumn(20).width = 30;
    worksheet.getColumn(21).width = 30;
    worksheet.getColumn(22).width = 30;
    worksheet.getColumn(23).width = 30;
    worksheet.getColumn(24).width = 30;
    worksheet.getColumn(25).width = 30;
    worksheet.getColumn(26).width = 30;
    worksheet.getColumn(27).width = 30;
    worksheet.getColumn(28).width = 30;
    worksheet.getColumn(29).width = 30;
    worksheet.getColumn(30).width = 30;
    worksheet.getColumn(31).width = 30;
    worksheet.getColumn(32).width = 30;
    worksheet.getColumn(33).width = 30;
    worksheet.getColumn(34).width = 30;
    worksheet.getColumn(35).width = 30;
    worksheet.getColumn(36).width = 30;
    worksheet.getColumn(37).width = 30;
    worksheet.getColumn(38).width = 30;
    worksheet.getColumn(38).width = 30;
    worksheet.addRow([]);
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'AllVechicleDetails' + '.xlsx');
    })
  }
}
