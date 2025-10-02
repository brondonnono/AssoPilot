import { Component, Input } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-metric-box',
  imports: [MatCardModule, MatIconModule],
  templateUrl: './metric-box.html',
  styleUrl: './metric-box.scss'
})
export class MetricBox {
  @Input() metric: any;
  @Input() bgColor?: string = '!bg-blue-200';
}
