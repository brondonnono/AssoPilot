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
import { ActionType } from '../../../core/enums/ActionType.enum';
import { CreateEditCotisationComponent } from './components/create-edit-cotisation/create-edit-cotisation.component';

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
    this.fetchCotisations();
  }

  fetchCotisations() {
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

  add() {
    this.openCreateEditCotisationModal(ActionType.CREATE).subscribe((res) => {
      if (res === '_SAVED') this.fetchCotisations();
    });
  }

  download() {}

  remove(cotisation: Cotisation) {
    this.openConfirmModal().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  edit(cotisation: Cotisation) {
    this.openCreateEditCotisationModal(ActionType.EDIT, cotisation).subscribe((res) => {
      if (res === '_SAVED') this.fetchCotisations();
    });
  }

  view(cotisation: Cotisation) {
    this.openCreateEditCotisationModal(ActionType.SHOW, cotisation);
  }

  openConfirmModal() {
    const dialogRef = this.dialog.open(ConfirmComponent);
    return dialogRef.afterClosed();
  }

  openCreateEditCotisationModal(action: ActionType, cotisation?: Cotisation) {
    const dialogRef = this.dialog.open(CreateEditCotisationComponent, {
      height: 'auto',
      width: '600px',
      data: {
        mode: action,
        cotisation: cotisation,
      },
    });
    return dialogRef.afterClosed();
  }
}
