import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-progress-dialog',
  templateUrl: './progress-dialog.component.html',
  styleUrls: ['./progress-dialog.component.scss']
})
export class ProgressDialogComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  @Input() size = 50;
  @Input() show: boolean;
}
