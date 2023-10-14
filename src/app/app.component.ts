import { Component, OnInit } from '@angular/core';
import { DialogFacadeService } from './store/dialog/dialog-facade.service';
import { tap, takeUntil } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private destroy$ = new Subject<void>();
  constructor(private dialogFacadeService: DialogFacadeService) { }

  ngOnInit(): void {
    this.dialogFacadeService.dialogIsOpen().pipe(
      takeUntil(this.destroy$),
      tap((isOpen)=> {
        if(isOpen){
          this.dialogFacadeService.checkForOpenDialogs(true);
        }
        this.destroy$.next();
        this.destroy$.complete();
      }),

    ).subscribe();
  }
}
