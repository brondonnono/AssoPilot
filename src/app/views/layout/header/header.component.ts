import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import { User } from '../../../core/models/User';
import { UserRole } from '../../../core/enums/UserRole.enum';
import { AuthService } from '../../../services/auth-service';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatTooltipModule, TranslatePipe],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Output() sidebarToggle = new EventEmitter<void>();
  appName = 'NDJANGUI';
  currentUser!: User;

  constructor(private authService: AuthService) {
    this.currentUser = {
      id: '1',
      username: 'Brondon Nono',
      password: '',
      role: UserRole.ADMIN,
      created_at: '',
    };
  }

  sidebarButtonClick() {
    this.sidebarToggle.emit();
  }

  logout() {
    this.authService.logout();
  }
}
