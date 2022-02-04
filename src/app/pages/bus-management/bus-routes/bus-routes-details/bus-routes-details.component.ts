import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { BusRouteDetailsListResponseData, PickupDropPoint } from '../../../../@theme/components/Model/BusRouteDetailsListResponse';
import { DateUtils } from '../../../../@theme/components/Services/date_utils';
import { HeaderInteractorService } from '../../../../@theme/components/Services/header-interactor.service';
import { Base64ImageConstants } from '../../../../@theme/components/Services/image_constants';
import { PdfUtils } from '../../../../@theme/components/Services/pdf_utils';
import { UtrackService } from '../../../../@theme/components/Services/Utrack.service';
import { CreateBusRoutePointComponent } from '../create-bus-route-point/create-bus-route-point.component';

@Component({
  selector: 'ngx-bus-routes-details',
  templateUrl: './bus-routes-details.component.html',
  styleUrls: ['./bus-routes-details.component.scss']
})
export class BusRoutesDetailsComponent implements OnInit {

  constructor(
    private uTrackService: UtrackService,
    private headerService: HeaderInteractorService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private dialog: MatDialog,
    private modalService: NgbModal,
    private toasterService: NbToastrService

  ) {
    this.activatedRoute.params.subscribe(params => {
      this.bus_route_id = params.bus_route_id;
    });
  }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.headerService.updateHeaderTitle('Route Details');
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    setTimeout(() => {
      this.bus_route_detail();
    }, 500);
  }

  Bus_Route_Details_Data: BusRouteDetailsListResponseData;

  bus_route_id: string
  route_name: string
  added_date_time: string
  status: string
  from_geofence_name: string
  to_geofence_name: string
  branch_name: string
  org_name: string

  ELEMENT_DATA: PickupDropPoint[] = [];
  displayedColumns: string[] = ['id', 'point_geofence_name', 'point_location_name', 'previous_location_duration_mins', 'point_type', 'added_date_time', 'status', 'edit'];
  dataSource = new MatTableDataSource<PickupDropPoint>(this.ELEMENT_DATA)
  TableDataNotshow: boolean = false;

  DROP_ELEMENT_DATA: PickupDropPoint[] = [];
  dropdisplayedColumns: string[] = ['id', 'point_geofence_name', 'point_location_name', 'previous_location_duration_mins', 'point_type', 'added_date_time', 'status', 'edit'];
  dropdataSource = new MatTableDataSource<PickupDropPoint>(this.ELEMENT_DATA)
  dropTableDataNotshow: boolean = false;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("content") content: ElementRef;


  bus_route_detail() {
    const formData = new FormData();
    formData.append('user_id', localStorage.getItem('USER_ID'));
    formData.append('bus_route_id', this.bus_route_id);

    this.uTrackService.bus_route_detail(formData).subscribe(response => {
      if (response.status) {
        if (response.data != null && response.data != undefined) {
          this.Bus_Route_Details_Data = response.data;
          this.route_name = this.Bus_Route_Details_Data.route_name;
          this.branch_name = this.Bus_Route_Details_Data.branch_name;
          this.org_name = this.Bus_Route_Details_Data.branch_name;
          this.from_geofence_name = this.Bus_Route_Details_Data.from_geofence_name;
          this.to_geofence_name = this.Bus_Route_Details_Data.to_location_name;
          this.added_date_time = this.Bus_Route_Details_Data.added_date_time;
          this.status = this.Bus_Route_Details_Data.status;
          this.ELEMENT_DATA = this.Bus_Route_Details_Data.pickup_point;
          this.DROP_ELEMENT_DATA = this.Bus_Route_Details_Data.drop_point;

          if (this.ELEMENT_DATA.length > 0) {
            this.TableDataNotshow = false;
          } else {
            this.TableDataNotshow = true;
          }

          if (this.DROP_ELEMENT_DATA.length > 0) {
            this.dropTableDataNotshow = false;
          } else {
            this.dropTableDataNotshow = true;
          }

          this.dataSource.data = this.ELEMENT_DATA;
          this.dropdataSource.data = this.DROP_ELEMENT_DATA;
        } else {
          this.Bus_Route_Details_Data = {} as BusRouteDetailsListResponseData;
          this.route_name = '';
          this.branch_name = '';
          this.org_name = '';
          this.from_geofence_name = '';
          this.to_geofence_name = '';
          this.added_date_time = '';
          this.status = '';
          this.TableDataNotshow = true;
          this.dropTableDataNotshow = true;
          this.ELEMENT_DATA = [];
        }
      }
    })

  }

  back() {
    this.location.back();
  }



  busRoute() {
    localStorage.setItem('BUS_ROUTE_ID', this.bus_route_id)
    let dialogReference = this.dialog.open(CreateBusRoutePointComponent, {
      width: '50%',
    })
    dialogReference.afterClosed().subscribe(result => {
      this.bus_route_detail();
    })
  }

  edit(model_data: PickupDropPoint) {
    localStorage.setItem('BUS_ROUTE_ID', this.bus_route_id)
    let rowData = JSON.stringify(model_data)
    let dialogReference = this.dialog.open(CreateBusRoutePointComponent, {
      width: '50%',
      data: { bus_point_id: rowData }
    })
    dialogReference.afterClosed().subscribe(result => {
      this.bus_route_detail();
    })
  }

  bus_point_id: string;
  deleteModel(OpenDeleteModal, bus_point_id) {
    this.bus_point_id = bus_point_id;
    this.modalService.open(OpenDeleteModal);
  }

  delete() {
    const formData = new FormData();
    formData.append('user_id', localStorage.getItem('USER_ID'));
    formData.append('bus_point_id', this.bus_point_id);

    this.uTrackService.bus_route_point_remove(formData).subscribe(response => {
      if (response.status) {
        this.toasterService.success('Pragati UTrack', response.message);
        this.modalService.dismissAll('Closed');
        this.bus_route_detail();
      } else {
        this.toasterService.danger('Pragati UTrack', response.message);
      }
    })
  }

  private filterValue = "";
  applyFilter(event: KeyboardEvent) {
    if (event.key == "Enter") {
      this.filterValue = (event.target as HTMLInputElement).value;
      this.filterValue = this.filterValue.trim(); // Remove whitespace
      this.dataSource.filter = this.filterValue;
      this.dataSource.data = this.ELEMENT_DATA;
    }
  }

  refresh() {
    this.bus_route_detail()
  }

  search() {
    this.filterValue = this.filterValue.trim(); // Remove whitespace
    this.filterValue = (document.getElementById('search_element') as HTMLInputElement).value;
    this.dataSource.filter = this.filterValue;
    this.dataSource.data = this.ELEMENT_DATA;
  }

  downloadPDF() {
    const title1 = 'UTrack Bus Pickup Point Report\n';
    const title2 = 'Report generated on ' + DateUtils.getDisplayTodayDateTime()
    const pdf_heading_date = title1.concat(title2);
    const dashboardColumns: string[] = ['ID', 'Point Geofence Name', 'Point Location Name', 'Previous Location Duration In Mins', 'Point Type', 'Added Date & Time', 'Status'];

    let data: String[][] = [];

    let i = 1;
    for (let value of this.ELEMENT_DATA) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(value.point_geofence_name)
      row.push(value.point_location_name)
      row.push(value.previous_location_duration_mins)
      row.push(value.point_type)
      row.push(DateUtils.getDisplayDateTime(value.added_date_time))
      row.push(value.status)
      data.push(row);
      i++;
    }
    PdfUtils.downloadPdf(pdf_heading_date, dashboardColumns, data, 'BusRoutePickupPointReport');
  }

  Exportexcle() {
    const columns = ['ID', 'Point Geofence Name', 'Point Location Name', 'Previous Location Duration In Mins', 'Point Type', 'Added Date & Time', 'Status'];
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

    worksheet.mergeCells('G1:G3');
    worksheet.addImage(ramkiLogo, 'G1:G3');
    //Add Row and formatting
    worksheet.mergeCells('C1', 'F2');
    let titleRow = worksheet.getCell('C1');
    titleRow.value = 'UTrack Bus Route Pickup PointReport'
    titleRow.font = {
      name: 'Calibri',
      size: 18,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' }
    }
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' }

    worksheet.mergeCells('C3', 'F3');
    let startToendData = worksheet.getCell('C3');
    startToendData.value = 'Report generated on' + ' ' + DateUtils.getDisplayTodayDateTime();
    startToendData.font = {
      name: 'Calibri',
      size: 14,
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
    for (let value of this.ELEMENT_DATA) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(value.point_geofence_name)
      row.push(value.point_location_name)
      row.push(value.previous_location_duration_mins)
      row.push(value.point_type)
      row.push(DateUtils.getDisplayDateTime(value.added_date_time))
      row.push(value.status)
      worksheet.addRow(row)
      i++;
    }
    worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 35;
    worksheet.getColumn(3).width = 35;
    worksheet.getColumn(4).width = 15;
    worksheet.getColumn(5).width = 15;
    worksheet.getColumn(6).width = 25;
    worksheet.getColumn(7).width = 15;
    worksheet.addRow([]);

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'BusRoutePickupPointReport' + '.xlsx');
    })
  }

  private drop_filterValue = "";
  dropapplyFilter(event: KeyboardEvent) {
    if (event.key == "Enter") {
      this.drop_filterValue = (event.target as HTMLInputElement).value;
      this.drop_filterValue = this.drop_filterValue.trim(); // Remove whitespace
      this.dropdataSource.filter = this.drop_filterValue;
      this.dropdataSource.data = this.DROP_ELEMENT_DATA;
    }
  }


  dropsearch() {
    this.drop_filterValue = this.drop_filterValue.trim(); // Remove whitespace
    this.drop_filterValue = (document.getElementById('drop_search_element') as HTMLInputElement).value;
    this.dropdataSource.filter = this.drop_filterValue;
    this.dropdataSource.data = this.DROP_ELEMENT_DATA;
  }

  dropdownloadPDF() {
    const title1 = 'UTrack Bus Drop Point Report\n';
    const title2 = 'Report generated on ' + DateUtils.getDisplayTodayDateTime()
    const pdf_heading_date = title1.concat(title2);
    const dashboardColumns: string[] = ['ID', 'Point Geofence Name', 'Point Location Name', 'Previous Location Duration In Mins', 'Point Type', 'Added Date & Time', 'Status'];

    let data: String[][] = [];

    let i = 1;
    for (let value of this.DROP_ELEMENT_DATA) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(value.point_geofence_name)
      row.push(value.point_location_name)
      row.push(value.previous_location_duration_mins)
      row.push(value.point_type)
      row.push(DateUtils.getDisplayDateTime(value.added_date_time))
      row.push(value.status)
      data.push(row);
      i++;
    }
    PdfUtils.downloadPdf(pdf_heading_date, dashboardColumns, data, 'BusRouteDropPointReport');
  }

  DopExportexcle() {
    const columns = ['ID', 'Point Geofence Name', 'Point Location Name', 'Previous Location Duration In Mins', 'Point Type', 'Added Date & Time', 'Status'];
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

    worksheet.mergeCells('G1:G3');
    worksheet.addImage(ramkiLogo, 'G1:G3');
    //Add Row and formatting
    worksheet.mergeCells('C1', 'F2');
    let titleRow = worksheet.getCell('C1');
    titleRow.value = 'UTrack Bus Route Drop Point Report'
    titleRow.font = {
      name: 'Calibri',
      size: 18,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' }
    }
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' }

    worksheet.mergeCells('C3', 'F3');
    let startToendData = worksheet.getCell('C3');
    startToendData.value = 'Report generated on' + ' ' + DateUtils.getDisplayTodayDateTime();
    startToendData.font = {
      name: 'Calibri',
      size: 14,
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
    for (let value of this.DROP_ELEMENT_DATA) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(value.point_geofence_name)
      row.push(value.point_location_name)
      row.push(value.previous_location_duration_mins)
      row.push(value.point_type)
      row.push(DateUtils.getDisplayDateTime(value.added_date_time))
      row.push(value.status)
      worksheet.addRow(row)
      i++;
    }
    worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 35;
    worksheet.getColumn(3).width = 35;
    worksheet.getColumn(4).width = 15;
    worksheet.getColumn(5).width = 15;
    worksheet.getColumn(6).width = 25;
    worksheet.getColumn(7).width = 15;
    worksheet.addRow([]);

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'BusRouteDropPointReport' + '.xlsx');
    })
  }
}
