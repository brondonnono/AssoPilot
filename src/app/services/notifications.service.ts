import { inject, Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private snackBar = inject(MatSnackBar);

  showMessage(
    message: string,
    isError = false,
    duration = 3000,
    hPosition: MatSnackBarHorizontalPosition = 'right',
    vPosition: MatSnackBarVerticalPosition = 'top'
  ) {
    this.snackBar.open(message, 'Close', {
      duration: duration,
      panelClass: isError ? ['!bg-red-600', '!text-white'] : ['!bg-green-600', '!text-white'],
      horizontalPosition: hPosition,
      verticalPosition: vPosition,
    });
  }
}
