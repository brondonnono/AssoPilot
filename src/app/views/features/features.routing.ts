import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Logs } from './logs/logs';
import { ManageMigration } from './manage-migration/manage-migration';
import { Events } from './events/events';
import { Cotisations } from './cotisations/cotisations';
import { Users } from './users/users';
import { Members } from './members/members';
import { Dashboard } from './dashboard/dashboard';

const routes: Routes = [
  {
    path: 'dashboard',
    component: Dashboard
  },
  {
    path: 'members',
    component: Members
  },
  {
    path: 'users',
   component: Users
  },
  {
    path: 'cotisations',
   component: Cotisations
  },
  {
    path: 'events',
   component: Events
  },
  {
    path: 'migration',
   component: ManageMigration
  },
  {
    path: 'logs',
   component: Logs
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeaturesRoutingModule {}
