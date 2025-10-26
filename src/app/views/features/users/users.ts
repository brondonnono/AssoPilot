import { Component, inject, OnInit } from '@angular/core';
import { ConfirmComponent } from '../../../shared/components/confirm/confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { User } from '../../../core/models/User';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import { TableComponent } from '../../../shared/components/table/table.component';
import { DatePipe } from '@angular/common';
import { ColumnTemplateDirective } from '../../../core/directives/ColumnTemplate.directive';
import { UserRole } from '../../../core/enums/UserRole.enum';
import { CreateEditUserComponent } from './components/create-edit-user/create-edit-user.component';
import { ActionType } from '../../../core/enums/ActionType.enum';
import { UserService } from '../../../services/user.service';
import { NotificationsService } from '../../../services/notifications.service';

@Component({
  selector: 'app-users',
  imports: [
    TranslatePipe,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    TableComponent,
    DatePipe,
    ColumnTemplateDirective,
  ],
  templateUrl: './users.html',
  styleUrls: ['./users.scss'],
})
export class Users implements OnInit {
  readonly dialog = inject(MatDialog);
  notificationService = inject(NotificationsService);
  private userService = inject(UserService);
  Role = UserRole;
  users: User[] = [];
  isFetchingData = false;
  displayedColumns = ['username', 'role', 'created_at', 'actions'];

  ngOnInit(): void {
    this.fetchUsers();
  }

  async fetchUsers() {
    this.isFetchingData = true;
    try {
      this.users = await this.userService.getAll();
      console.log(this.users); // Utilisez await ici
    } catch (error) {
      console.error('Get users error: ', error);
      this.notificationService.showMessage('Error fetching users', true);
    } finally {
      this.isFetchingData = false;
    }
  }

  async add() {
    const result = await this.openCreateEditUserModal(ActionType.CREATE).toPromise();
    if (result === '_SAVED') this.fetchUsers();
  }

  download() {
    console.log('export');
  }

  async remove(user: User) {
    const result = await this.openConfirmModal().toPromise();
    if (result) {
      try {
        await this.userService.delete(user.id); // Assurez-vous que delete() est une méthode du UserService
        this.fetchUsers();
        this.notificationService.showMessage('User deleted successfully');
      } catch (error) {
        console.error('Error deleting user:', error);
        this.notificationService.showMessage('Error deleting user', true);
      }
    }
  }

  async edit(user: User) {
    const result = await this.openCreateEditUserModal(ActionType.EDIT, user).toPromise();
    if (result === '_SAVED') this.fetchUsers();
  }

  view(user: User) {
    this.openCreateEditUserModal(ActionType.SHOW, user);
  }

  openConfirmModal() {
    const dialogRef = this.dialog.open(ConfirmComponent);
    return dialogRef.afterClosed();
  }

  openCreateEditUserModal(action: ActionType, user?: User) {
    const dialogRef = this.dialog.open(CreateEditUserComponent, {
      height: 'auto',
      width: '500px',
      data: {
        mode: action,
        user: user,
      },
    });
    return dialogRef.afterClosed();
  }
}
