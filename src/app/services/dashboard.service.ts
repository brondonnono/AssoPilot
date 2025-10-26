import { Injectable, inject } from '@angular/core';
import { ElectronService } from './electron.service';
import { Metric } from '../core/models/Metric';

export interface DashboardData {
  totalUsers: number;
  totalEvents: number;
  totalMembers: number;
  totalCotisations: number;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private electron = inject(ElectronService);

  /**
   * Fetch all data for the dashboard
   */
  async getDashboardData(): Promise<Metric[]> {
    const [totalUsersResult, totalEventsResult, totalMembersResult, totalCotisationsResult] =
      await Promise.all([
        this.electron.runQuery('SELECT COUNT(*) as count FROM users'),
        this.electron.runQuery('SELECT COUNT(*) as count FROM events'),
        this.electron.runQuery('SELECT COUNT(*) as count FROM members'),
        this.electron.runQuery('SELECT COUNT(*) as count FROM cotisations'),
      ]);

    const resultsData = {
      totalUsers: totalUsersResult[0]?.count || 0,
      totalEvents: totalEventsResult[0]?.count || 0,
      totalMembers: totalMembersResult[0]?.count || 0,
      totalCotisations: totalCotisationsResult[0]?.count || 0,
    };

    return this.initMetrics(resultsData);
  }

  private initMetrics(data: DashboardData): Metric[] {
    return [
      {
        title: 'common.users',
        description: 'common.user-stat',
        value: data.totalUsers.toString(),
        icon: 'ri-group-2-line',
        bgColor: '!bg-green-300',
      },
      {
        title: 'common.events',
        description: 'common.event-stat',
        value: data.totalEvents.toString(),
        icon: 'ri-calendar-event-line',
        bgColor: '!bg-orange-300',
      },
      {
        title: 'common.members',
        description: 'common.member-stat',
        value: data.totalMembers.toString(),
        icon: 'ri-team-line',
        bgColor: '!bg-blue-300',
      },
      {
        title: 'common.cotisations',
        description: 'common.cotisation-stat',
        value: data.totalCotisations.toString(),
        icon: 'ri-wallet-3-line',
        bgColor: '!bg-purple-300',
      },
    ];
  }
}
