import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Member } from '../../../core/models/Member';

@Component({
  selector: 'app-item-box',
  imports: [],
  template: `<div class="!shadow-sm border rounded-full p-2">
    <span>{{ item.name }}</span>
  </div>`,
  styleUrl: './itemBox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemBoxComponent {
  @Input() item!: Member;

  constructor() {
    console.log(this.item);
  }
}
