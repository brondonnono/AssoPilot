import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import { ColumnTemplateDirective } from '../../../core/directives/ColumnTemplate.directive';
import { Member } from '../../../core/models/Member';
import { ConfirmComponent } from '../../../shared/components/confirm/confirm.component';
import { TableComponent } from '../../../shared/components/table/table.component';
import { MemberStatus } from '../../../core/enums/MemberStatus.enum';
import { CreateEditMemberComponent } from './components/create-edit-member/create-edit-member.component';
import { ActionType } from '../../../core/enums/ActionType.enum';
import { MemberService } from '../../../services/member.service';
import { NotificationsService } from '../../../services/notifications.service';

@Component({
  selector: 'app-members',
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
  templateUrl: './members.html',
  styleUrl: './members.scss',
})
export class Members implements OnInit {
  readonly dialog = inject(MatDialog);
  notificationService = inject(NotificationsService);
  private memberService = inject(MemberService);

  status = MemberStatus;
  members: Member[] = [];
  isFetchingData = false;
  displayedColumns = ['name', 'phone', 'cni', 'status', 'joined_date', 'actions'];

  ngOnInit(): void {
    this.fetchMembers();
  }

  async fetchMembers() {
    this.isFetchingData = true;
    try {
      this.members = await this.memberService.getAll();
      console.log(this.members);
    } catch (error) {
      console.error('Get members error: ', error);
      this.notificationService.showMessage('Error fetching members', true);
    } finally {
      this.isFetchingData = false;
    }
  }

  async add() {
    const result = await this.openCreateEditMemberModal(ActionType.CREATE).toPromise();
    if (result === '_SAVED') this.fetchMembers();
  }

  download() {
    console.log('export');
  }

  async remove(member: Member) {
    const result = await this.openConfirmModal().toPromise();
    if (result) {
      try {
        await this.memberService.delete(member.id);
        this.fetchMembers();
        this.notificationService.showMessage('Member deleted successfully');
      } catch (error) {
        console.error('Error deleting member:', error);
        this.notificationService.showMessage('Error deleting member', true);
      }
    }
  }

  async edit(member: Member) {
    const result = await this.openCreateEditMemberModal(ActionType.EDIT, member).toPromise();
    if (result === '_SAVED') this.fetchMembers();
  }

  view(member: Member) {
    this.openCreateEditMemberModal(ActionType.SHOW, member);
  }

  openConfirmModal() {
    const dialogRef = this.dialog.open(ConfirmComponent);
    return dialogRef.afterClosed();
  }

  openCreateEditMemberModal(action: ActionType, member?: Member) {
    const dialogRef = this.dialog.open(CreateEditMemberComponent, {
      height: 'auto',
      width: '600px',
      data: {
        mode: action,
        member: member,
      },
    });
    return dialogRef.afterClosed();
  }
}
