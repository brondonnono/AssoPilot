import { Component, inject, OnInit } from '@angular/core';
import { MetricBox } from './components/metric-box/metric-box';
import { EventTable } from '../../../shared/components/event-table/event-table';
import { TranslatePipe } from '@ngx-translate/core';
import { Event as IEvent } from '../../../core/models/Event';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { Metric } from '../../../core/models/Metric';
import { EventService } from '../../../services/event.service';
import { NotificationsService } from '../../../services/notifications.service';

@Component({
  selector: 'app-dashboard',
  imports: [MetricBox, EventTable, TranslatePipe, MatCardModule, MatButtonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private readonly eventService = inject(EventService);
  private notificationService = inject(NotificationsService);

  upcomingEvents: IEvent[] = [];
  isFetchingData = true;

  metrics: Metric[] = [];

  ngOnInit(): void {
    this.fetchUpcomingEvents();
    this.getStatistics();
  }

  async fetchUpcomingEvents() {
    this.isFetchingData = true;
    try {
      this.upcomingEvents = await this.eventService.getAll();
      console.log(this.upcomingEvents);
    } catch (error) {
      console.error('Get upcoming events error: ', error);
      this.notificationService.showMessage('Error fetching upcoming events', true);
    } finally {
      this.isFetchingData = false;
    }
  }

  getStatistics() {
    this.isFetchingData = true;
    this.metrics = this.dashboardService.getStatistics();
    this.isFetchingData = false;
  }
}
