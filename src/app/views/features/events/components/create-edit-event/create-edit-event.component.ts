import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-create-edit-event',
  imports: [],
  templateUrl: './create-edit-event.component.html',
  styleUrl: './create-edit-event.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateEditEventComponent implements OnInit {
  constructor(public fb: FormBuilder) {}

  ngOnInit(): void {}
}
