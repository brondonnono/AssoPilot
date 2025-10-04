import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appColumnTemplate]',
  standalone: true,
})
export class ColumnTemplateDirective {
  @Input('appColumnTemplate') column!: string;

  constructor(public template: TemplateRef<any>) {}
}
