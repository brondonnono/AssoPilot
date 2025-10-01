import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints, LayoutModule } from '@angular/cdk/layout';


@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, SidebarComponent, HeaderComponent, MatSidenavModule, LayoutModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  isSidebarOpen = true;
  breakpointObserver = inject(BreakpointObserver);
  constructor() {}

  ngOnInit() {
    this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small]).subscribe( res => {
      if(this.breakpointObserver.isMatched([Breakpoints.XSmall, Breakpoints.Small])) {
        this.isSidebarOpen = false;
      } else this.isSidebarOpen = true;
    })
  }
}
