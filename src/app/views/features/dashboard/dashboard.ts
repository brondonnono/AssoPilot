import { Component, OnInit } from '@angular/core';
import { MetricBox } from './components/metric-box/metric-box';
import { EventTable } from '../../../shared/components/event-table/event-table';
import { TranslatePipe } from '@ngx-translate/core';
import { MockDataService } from '../../../services/MockData.service';
import { Event as IEvent } from '../../../core/models/Event';

@Component({
  selector: 'app-dashboard',
  imports: [MetricBox, EventTable, TranslatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {

  upcomingEvents: IEvent[] = [];
  isFetchingData = true;

  constructor(private mockDataService: MockDataService) { }

  ngOnInit(): void {
    this.isFetchingData = true;
    this.mockDataService.getEvents().subscribe({
      next: (events => {
        this.upcomingEvents = this.mockDataService.getUpcomingEvents(events);
      }),
      error: (error => {
        this.isFetchingData = false;
        console.log("Get events error: ", error)
      }),
      complete: () => {
        this.isFetchingData = false;
      }
    });
  }
}
