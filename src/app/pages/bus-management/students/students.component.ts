import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CustomerManagementDetails } from '../../../@theme/components/Model/CustomerManagementDetails';
import { HeaderInteractorService } from '../../../@theme/components/Services/header-interactor.service';

@Component({
  selector: 'ngx-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {

  constructor(private headerService: HeaderInteractorService) { }

  ngOnInit(): void {
    this.headerService.updateHeaderTitle('Students')
  }
  ELEMENT_DATA: CustomerManagementDetails[] = [];
  displayedColumns: string[] = ['id', 'name', 'logo_image', 'type', 'bus_visibility', 'track_history_visibility', 'added_by_id', 'added_date_time', 'updated_date_time', 'status', 'edit'];
  dataSource = new MatTableDataSource<CustomerManagementDetails>(this.ELEMENT_DATA)

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("content") content: ElementRef;

  fetchDataFromApi() {

  }
  private filterValue = "";

  applyFilter(event: KeyboardEvent) {
    if (event.key == "Enter") {
      this.filterValue = (event.target as HTMLInputElement).value;
      this.filterValue = this.filterValue.trim(); // Remove whitespace
      this.dataSource.filter = this.filterValue;
      this.fetchDataFromApi();
    }
  }

  refresh() {
    this.fetchDataFromApi()
  }

  search() {
    this.filterValue = this.filterValue.trim(); // Remove whitespace
    this.filterValue = (document.getElementById('search_element') as HTMLInputElement).value;
    this.dataSource.filter = this.filterValue;
    this.fetchDataFromApi();
  }

  back() {
  }
  add() {

  }
  edit(model_data: CustomerManagementDetails) {

  }

  editCustomer(customer_id) {

  }

  downloadPDF() {
  }

  Exportexcle() {

  }
}
