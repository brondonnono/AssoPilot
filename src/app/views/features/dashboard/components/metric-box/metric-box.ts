import { Component, Input } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Metric } from '../../../../../core/models/Metric';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-metric-box',
  imports: [MatCardModule, MatIconModule, MatTooltipModule, TranslatePipe],
  templateUrl: './metric-box.html',
  styleUrl: './metric-box.scss',
})
export class MetricBox {
  @Input() metric!: Metric;
  @Input() bgColor?: string = '!bg-blue-200';
}
