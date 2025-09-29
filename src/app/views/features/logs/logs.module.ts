import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogsComponent } from './logs.component';
import { LogsRoutingModule } from './logs.routing';

@NgModule({
  imports: [
    CommonModule,
    LogsRoutingModule
  ],
  declarations: [LogsComponent]
})
export class LogsModule { }
