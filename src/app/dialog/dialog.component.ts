import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { DialogFacadeService } from '../store/dialog/dialog-facade.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
  @Input() dialogTitle: string = '';
  @Input() contentTemplate: any;
  faTimesCircle = faTimesCircle;
  title$: Observable<string>;
  content$: Observable<any>;
  isOpen$: Observable<boolean>;

  constructor(private dialogFacade: DialogFacadeService, private dialog: MatDialog) {
    this.title$ = this.dialogFacade.title();
    this.content$ = this.dialogFacade.content();
    this.isOpen$ = this.dialogFacade.dialogIsOpen();
   }

  public close(): void {
    this.dialogFacade.closeDialog();
  }
}
