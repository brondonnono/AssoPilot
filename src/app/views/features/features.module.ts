import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeaturesRoutingModule } from './features.routing';
import { HeaderComponent } from '../shared-components/header/header.component';

@NgModule({
  imports: [
    CommonModule,
    FeaturesRoutingModule
  ],
})
export class FeaturesModule { }
