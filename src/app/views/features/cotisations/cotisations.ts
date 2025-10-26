import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import { ColumnTemplateDirective } from '../../../core/directives/ColumnTemplate.directive';
import { TableComponent } from '../../../shared/components/table/table.component';
import { ConfirmComponent } from '../../../shared/components/confirm/confirm.component';
import { Cotisation } from '../../../core/models/Cotisation';
import { ActionType } from '../../../core/enums/ActionType.enum';
import { CreateEditCotisationComponent } from './components/create-edit-cotisation/create-edit-cotisation.component';
import { CotisationService } from '../../../services/cotisation.service';
import { NotificationsService } from '../../../services/notifications.service';

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
export class Cotisations implements OnInit {
  readonly dialog = inject(MatDialog);
  notificationService = inject(NotificationsService);
  private cotisationService = inject(CotisationService);

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

  ngOnInit(): void {
    this.fetchCotisations();
  }

  async fetchCotisations() {
    this.isFetchingData = true;
    try {
      this.cotisations = await this.cotisationService.getAll();
      console.log(this.cotisations); // Utilisez await ici
    } catch (error) {
      console.error('Get cotisations error: ', error);
      this.notificationService.showMessage('Error fetching cotisations', true);
    } finally {
      this.isFetchingData = false;
    }
  }

  async add() {
    const result = await this.openCreateEditCotisationModal(ActionType.CREATE).toPromise();
    if (result === '_SAVED') this.fetchCotisations();
  }

  download() {
    console.log('export');
  }

  async remove(cotisation: Cotisation) {
    const result = await this.openConfirmModal().toPromise();
    if (result) {
      try {
        await this.cotisationService.delete(cotisation.id);
        this.fetchCotisations();
        this.notificationService.showMessage('Cotisation deleted successfully');
      } catch (error) {
        console.error('Error deleting cotisation:', error);
        this.notificationService.showMessage('Error deleting cotisation', true);
      }
    }
  }

  async edit(cotisation: Cotisation) {
    const result = await this.openCreateEditCotisationModal(
      ActionType.EDIT,
      cotisation
    ).toPromise();
    if (result === '_SAVED') this.fetchCotisations();
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
