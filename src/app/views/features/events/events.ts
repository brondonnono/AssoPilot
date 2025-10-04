import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import { MockDataService } from '../../../services/MockData.service';
import { Event as IEvent } from '../../../core/models/Event';
import { EventTable } from '../../../shared/components/event-table/event-table';

@Component({
  selector: 'app-events',
  imports: [TranslatePipe, MatButtonModule, MatIconModule, MatTooltipModule, EventTable],
  templateUrl: './events.html',
  styleUrl: './events.scss',
})
export class Events implements OnInit {
  events: IEvent[] = [];
  isFetchingData = false;

  constructor(private mockDataService: MockDataService) {}

  ngOnInit(): void {
    this.isFetchingData = true;
    this.mockDataService.getEvents().subscribe({
      next: (res) => {
        this.events = res;
      },
      error: (error) => {
        this.isFetchingData = false;
        console.log('Get events error: ', error);
      },
      complete: () => {
        this.isFetchingData = false;
      },
    });
  }

  add() {}

  download() {}
}
