import { Component, inject } from '@angular/core';
import { ConfirmComponent } from '../../../shared/components/confirm/confirm.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MockDataService } from '../../../services/MockData.service';
import { User } from '../../../core/models/User';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import { TableComponent } from '../../../shared/components/table/table.component';
import { DatePipe } from '@angular/common';
import { ColumnTemplateDirective } from '../../../core/directives/ColumnTemplate.directive';
import { UserRole } from '../../../core/enums/UserRole.enum';
import { CreateUserComponent } from './components/create-user/create-user.component';

@Component({
  selector: 'app-users',
  imports: [
    TranslatePipe,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    TableComponent,
    DatePipe,
    ColumnTemplateDirective,
  ],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users {
  readonly dialog = inject(MatDialog);
  Role = UserRole;
  users: User[] = [];
  isFetchingData = false;
  displayedColumns = ['username', 'role', 'created_at', 'actions'];
  constructor(private mockDataService: MockDataService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers() {
    this.isFetchingData = true;
    this.mockDataService.getUsers().subscribe({
      next: (res) => {
        this.users = res;
      },
      error: (error) => {
        this.isFetchingData = false;
        console.log('Get users error: ', error);
      },
      complete: () => {
        this.isFetchingData = false;
      },
    });
  }

  add() {
    this.openCreateUserModal().subscribe((res) => {
      this.fetchUsers();
    });
    console.log('user');
  }

  download() {}

  remove(user_id: string) {
    this.openConfirmModal().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
  edit(user_id: string) {}
  view(user_id: string) {
    console.log(user_id);
  }

  openConfirmModal() {
    const dialogRef = this.dialog.open(ConfirmComponent);
    return dialogRef.afterClosed();
  }

  openCreateUserModal() {
    const dialogRef = this.dialog.open(CreateUserComponent, {
      height: 'auto',
      width: '500px',
    });
    return dialogRef.afterClosed();
  }
}
