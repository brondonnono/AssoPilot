import { Component, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { NavItem, navItems } from '../../../core/utils/navItems';
import { User } from '../../../core/models/User';
import { UserRole } from '../../../core/enums/UserRole.enum';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-sidebar',
  imports: [MatListModule, TranslatePipe, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  navMenu: NavItem[] = [];
  currentUser!: User;

  constructor() {
    this.currentUser = {
      id: '1',
      username: 'Brondon Nono',
      password: '',
      role: UserRole.ADMIN,
      created_at: '',
    };
  }

  ngOnInit(): void {
    navItems.forEach((item: NavItem) => {
      if (item.canSee.includes(this.currentUser.role)) this.navMenu.push(item);
    });
  }
}
