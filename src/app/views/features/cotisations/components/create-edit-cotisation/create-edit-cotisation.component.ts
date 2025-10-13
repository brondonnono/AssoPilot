import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-edit-cotisation',
  imports: [],
  templateUrl: './create-edit-cotisation.component.html',
  styleUrl: './create-edit-cotisation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateEditCotisationComponent implements OnInit {
  constructor() {}
  ngOnInit(): void {}
}
