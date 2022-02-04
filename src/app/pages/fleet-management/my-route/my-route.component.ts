import { Component, OnInit, ViewChild } from '@angular/core';
import { HeaderInteractorService } from '../../../@theme/components/Services/header-interactor.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { RouteListResponse, RouteListResponseData } from '../../../@theme/components/Model/RouteListResponse';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { PdfUtils } from '../../../@theme/components/Services/pdf_utils';
import { DateUtils } from '../../../@theme/components/Services/date_utils';
import { Base64ImageConstants } from '../../../@theme/components/Services/image_constants';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';

@Component({
  selector: 'ngx-my-route',
  templateUrl: './my-route.component.html',
  styleUrls: ['./my-route.component.scss']
})
export class MyRouteComponent implements OnInit {

  TableDataNotshow: boolean;

  MyRouteData: RouteListResponseData[] = []
  displayedColumn: string[] = [
    'id',
    'route_name',
    'start_location',
    'end_location',
    'stops',
    'trips',
    'vehicles',
    'distance',
    'duretion',
    'Actions'
  ];
  MyRouteListdataSource = new MatTableDataSource<RouteListResponseData>(this.MyRouteData)

  @ViewChild('TableOneSort', { static: true }) MyRouteListsort: MatSort;
  constructor(
    private headerService: HeaderInteractorService,
    private location: Location,
    private http: HttpClient,
    private routes: Router,
    private activatedRoute: ActivatedRoute,
    private uTrackService :UtrackService,
   ) { }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    this.headerService.updateHeaderTitle('HEADER_NAMES.Routes')
    this.MyRouteListdataSource.sort = this.MyRouteListsort;
    this.getMyRouteList();
  }

  back() {
    this.location.back();
  }

  createMyRoute() {
    this.routes.navigate([`../create-route`],
      { relativeTo: this.activatedRoute })
  }

  myrouteDetails(route_name, start_location, end_location, distance, travel_time_mins) {
    this.routes.navigate([`../route-details`, route_name, start_location, end_location, distance, travel_time_mins],
      { relativeTo: this.activatedRoute })
  }

  private filterValue = "";

  applyFilter(event: KeyboardEvent) {
    if (event.key == "Enter") {
      this.filterValue = (event.target as HTMLInputElement).value;
      this.filterValue = this.filterValue.trim(); // Remove whitespace
      this.MyRouteListdataSource.filter = this.filterValue;
      this.MyRouteListdataSource.data = this.MyRouteData
    }
  }

  search() {
    this.filterValue = this.filterValue.trim(); // Remove whitespace
    this.filterValue = (document.getElementById('searchMyrouteName') as HTMLInputElement).value;
    this.MyRouteListdataSource.filter = this.filterValue;
    this.MyRouteListdataSource.data = this.MyRouteData
  }

  refresh() {
    this.getMyRouteList()
  }

  downloadPDF() {
    const title1 = 'UTrack My Routes Report \n';
    const title3 = 'Generated Date ' + DateUtils.getDisplayTodayDateTime();
    const pdf_heading_date = title1.concat(title3);
    let MyrouteListTableColumn: string[] = ['ID', 'Route Name', 'Source Location', 'Distance Location', 'Stops', 'Trips', 'Vehicles', 'Distance (KM)', 'Duration',];
    let data: String[][] = [];
    let i = 1;
    this.MyRouteData.forEach(function (value) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(value.route_name)
      row.push(value.start_location)
      row.push(value.end_location)
      row.push('3')
      row.push('2')
      row.push('6')
      row.push(value.distance)
      row.push(value.travel_time_mins)
      data.push(row);
      i++;
    }),
      PdfUtils.downloadPdf(pdf_heading_date, MyrouteListTableColumn, data, 'MyRouteListDetails');
  }

  exportexcle() {
    const columns = ['ID', 'Route Name', 'Source Location', 'Distance Location', 'Stops', 'Trips', 'Vehicles', 'Distance (KM)', 'Duration',];
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

    worksheet.mergeCells('E1:G3');
    worksheet.addImage(ramkiLogo, 'E1:G3');
    //Add Row and formatting
    worksheet.mergeCells('C1', 'D2');
    let titleRow = worksheet.getCell('C1');
    titleRow.value = 'UTrack My Routes Report'
    titleRow.font = {
      name: 'Calibri',
      size: 18,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' }
    }
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' }

    worksheet.mergeCells('C3', 'D3');
    let startToendData = worksheet.getCell('C3');
    startToendData.value = 'Generated Date' + ' ' + converted_reportdate
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
    this.MyRouteData.forEach(function (value) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(value.route_name)
      row.push(value.start_location)
      row.push(value.end_location)
      row.push('3')
      row.push('2')
      row.push('6')
      row.push(value.distance)
      row.push(value.travel_time_mins)
      worksheet.addRow(row)
      i++;
    }),
      worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 23;
    worksheet.getColumn(3).width = 80;
    worksheet.getColumn(4).width = 80;
    worksheet.getColumn(5).width = 7;
    worksheet.getColumn(6).width = 7;
    worksheet.getColumn(7).width = 10;
    worksheet.getColumn(8).width = 18;
    worksheet.getColumn(9).width = 12;
    worksheet.addRow([]);

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'MyRouteListDetails' + '.xlsx');
    })
  }

  getMyRouteList() {
    const params = new HttpParams()
      .set('user_id', localStorage.getItem("USER_ID"))
      .set('device_token', "Web")
      .set('X-Api-Key', environment.X_API_KEY)
    this.http.get<RouteListResponse>(environment.apiBaseUrl + 'route_list', { params }).subscribe(response => {
      this.MyRouteData=[];
         if (response.status && response.data != null && response.data != undefined && response.data.length > 0) {
          this.TableDataNotshow = false;
          this.MyRouteData = response.data
        } else {
          this.TableDataNotshow = true;
        }
      this.MyRouteListdataSource.data = this.MyRouteData;
    })
  }
}
