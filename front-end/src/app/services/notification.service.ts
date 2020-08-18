import {Injectable} from '@angular/core';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(public snackBar: MatSnackBar) {
  }

  config: MatSnackBarConfig = {
    duration: 3000,
    horizontalPosition: 'right',
    verticalPosition: 'top'
  };
  confirmProductDeleted(msg): void {
    this.config.panelClass = ['notification', 'confirmDelete'];
    this.snackBar.open(msg, '', this.config);
  }

  edit(msg): void {
    this.config.panelClass = ['notification', 'edit'];
    this.snackBar.open(msg, '', this.config);
  }

  delete(msg): void {
    this.config.panelClass = ['notification', 'delete'];
    this.snackBar.open(msg, '', this.config);
  }

  create(msg): void {
    this.config.panelClass = ['notification', 'create'];
    this.snackBar.open(msg, '', this.config);
  }
}
