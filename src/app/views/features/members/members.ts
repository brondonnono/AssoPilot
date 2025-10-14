import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import { ColumnTemplateDirective } from '../../../core/directives/ColumnTemplate.directive';
import { Member } from '../../../core/models/Member';
import { MockDataService } from '../../../services/MockData.service';
import { ConfirmComponent } from '../../../shared/components/confirm/confirm.component';
import { TableComponent } from '../../../shared/components/table/table.component';
import { MemberStatus } from '../../../core/enums/MemberStatus.enum';
import { CreateEditMemberComponent } from './components/create-edit-member/create-edit-member.component';
import { ActionType } from '../../../core/enums/ActionType.enum';
import { ImportExportDataService } from '../../../services/import-export-data.service';

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
export class Members {
  readonly dialog = inject(MatDialog);
  status = MemberStatus;
  members: Member[] = [];
  isFetchingData = false;
  displayedColumns = ['name', 'phone', 'cni', 'status', 'joined_date', 'actions'];
  constructor(
    private mockDataService: MockDataService,
    private exportDataService: ImportExportDataService
  ) {}

  ngOnInit(): void {
    this.fetchMembers();
  }

  fetchMembers() {
    this.isFetchingData = true;
    this.mockDataService.getMembers().subscribe({
      next: (res) => {
        this.members = res;
      },
      error: (error) => {
        this.isFetchingData = false;
        console.log('Get members error: ', error);
      },
      complete: () => {
        this.isFetchingData = false;
      },
    });
  }

  add() {
    this.openCreateEditMemberModal(ActionType.CREATE).subscribe((res) => {
      if (res === '_SAVED') this.fetchMembers();
    });
  }

  download() {
    this.exportDataService.exportToExcel(this.members, 'members.xlsx');
  }

  remove(member: Member) {
    this.openConfirmModal().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  edit(member: Member) {
    this.openCreateEditMemberModal(ActionType.EDIT, member).subscribe((res) => {
      if (res === '_SAVED') this.fetchMembers();
    });
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
