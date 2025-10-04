import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class CustomMatPaginatorIntl extends MatPaginatorIntl {
  constructor(private translateService: TranslateService) {
    super();

    this.translateLabels();

    this.translateService.onLangChange.subscribe(() => {
      this.translateLabels();
      this.changes.next();
    });
  }

  translateLabels() {
    this.itemsPerPageLabel = this.translateService.instant('paginator.items-per-page');
    this.nextPageLabel = this.translateService.instant('paginator.next-page');
    this.previousPageLabel = this.translateService.instant('paginator.previous-page');
    this.firstPageLabel = this.translateService.instant('paginator.first-page');
    this.lastPageLabel = this.translateService.instant('paginator.last-page');
    this.getRangeLabel = (page: number, pageSize: number, length: number) => {
      if (length === 0 || pageSize === 0) {
        return this.translateService.instant('paginator.range-page', { start: 0, end: 0, length });
      }
      const startIndex = page * pageSize;
      const endIndex =
        startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
      return this.translateService.instant('paginator.range-page', {
        start: startIndex + 1,
        end: endIndex,
        length,
      });
    };
  }
}
