import {
  AfterViewInit,
  Component,
  ViewChild,
  EventEmitter,
  Output,
  Input,
  OnInit,
} from '@angular/core';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Event as IEvent } from '../../../core/models/Event';
import { TranslatePipe } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import { CustomMatPaginatorIntl } from '../../../core/utils/paginator-intl';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-event-table',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatTooltipModule,
    TranslatePipe,
    DatePipe,
  ],
  providers: [
    {
      provide: MatPaginatorIntl,
      useClass: CustomMatPaginatorIntl,
    },
  ],
  templateUrl: './event-table.html',
  styleUrl: './event-table.scss',
})
export class EventTable implements OnInit, AfterViewInit {
  @Output() eventTableAction: EventEmitter<any> = new EventEmitter<any>();
  @Input() withSearch: boolean = false;
  @Input() withPagination: boolean = false;
  @Input() withAllActions: boolean = false;
  @Input() events: IEvent[] = [];

  displayedColumns: string[] = ['title', 'description', 'start_date', 'location', 'action'];
  dataSource: MatTableDataSource<IEvent> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {}
  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.events);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  handleTableAction(action: string, row: any) {
    const outputObject = {
      action: action,
      data: row,
    };
    this.eventTableAction.emit(outputObject);
  }
}
