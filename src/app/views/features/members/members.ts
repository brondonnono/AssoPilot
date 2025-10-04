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
  constructor(private mockDataService: MockDataService) {}

  ngOnInit(): void {
    this.isFetchingData = true;
    this.mockDataService.getMembers().subscribe({
      next: (res) => {
        this.members = res;
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

  add() {}

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
}
