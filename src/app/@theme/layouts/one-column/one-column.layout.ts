import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-one-column-layout',
  styleUrls: ['./one-column.layout.scss'],
  templateUrl: './one-column.layout.html',
})
export class OneColumnLayoutComponent {
  constructor(private routes: Router) { }
  home() {
    this.routes.navigate(["web"])
  }
}
