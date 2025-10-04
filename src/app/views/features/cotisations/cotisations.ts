import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import { ColumnTemplateDirective } from '../../../core/directives/ColumnTemplate.directive';
import { TableComponent } from '../../../shared/components/table/table.component';
import { MockDataService } from '../../../services/MockData.service';
import { ConfirmComponent } from '../../../shared/components/confirm/confirm.component';
import { Cotisation } from '../../../core/models/Cotisation';

@Component({
  selector: 'app-cotisations',
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
  templateUrl: './cotisations.html',
  styleUrl: './cotisations.scss',
})
export class Cotisations {
  readonly dialog = inject(MatDialog);
  cotisations: Cotisation[] = [];
  isFetchingData = false;
  displayedColumns = [
    'title',
    'amount',
    'frequency',
    'start_date',
    'participant_number',
    'actions',
  ];
  constructor(private mockDataService: MockDataService) {}

  ngOnInit(): void {
    this.isFetchingData = true;
    this.mockDataService.getCotisations().subscribe({
      next: (res) => {
        this.cotisations = res.map((c) => ({
          ...c,
          participant_number: c.members.length,
        }));
      },
      error: (error) => {
        this.isFetchingData = false;
        console.log('Get cotisations error: ', error);
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
