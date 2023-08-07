import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';

import { AlertPopupComponent } from './alert-popup/alert-popup.component';

@Injectable()
export class AlertService {

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  public alert(message: string, title?: string, buttons?: string[]): Observable<number> {
    const dialog = this.dialog.open(AlertPopupComponent, {
      maxWidth: '100%',
      width: '350px',
      data: { message, title, buttons },
      disableClose: true,
      scrollStrategy: new NoopScrollStrategy()
    });

    return dialog.afterClosed();
  }

  public toast(message: string, duration = 3000) {
    this.snackBar.open(message, '', { duration });
  }

}
