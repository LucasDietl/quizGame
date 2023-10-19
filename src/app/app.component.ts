import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';
import { Component, HostListener, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, first, takeUntil, tap } from 'rxjs/operators';
import { CommonFacadeService } from './store/common/common-facade.service';
import { DialogFacadeService } from './store/dialog/dialog-facade.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private destroyed$ = new Subject<void>();
  resizeSubject = new Subject<void>();
  currentScreenSize: string = 'Unknown';
  displayNameMap = new Map([
    [Breakpoints.XSmall, 'XSmall'],
    [Breakpoints.Small, 'Small'],
    [Breakpoints.Medium, 'Medium'],
    [Breakpoints.Large, 'Large'],
    [Breakpoints.XLarge, 'XLarge'],
  ]);
  @HostListener('window:resize', ['$event'])
  onResize(_: any) {
    this.resizeSubject.next();
  }
  constructor(
    private dialogFacadeService: DialogFacadeService,
    private breakpointObserver: BreakpointObserver,
    private commonFacadeService: CommonFacadeService) {
  }


  ngOnInit(): void {
    this.dialogFacadeService.dialogIsOpen().pipe(
      takeUntil(this.destroyed$),
      tap((isOpen) => {
        if (isOpen) {
          this.dialogFacadeService.checkForOpenDialogs(true);
        }
        this.destroyed$.next();
        this.destroyed$.complete();
      }),

    ).pipe(takeUntil(this.destroyed$)).subscribe();
    this.checkViewportSize();

    this.resizeSubject.pipe(
      debounceTime(300),
    ).pipe(takeUntil(this.destroyed$)).subscribe(() => {
      this.checkViewportSize();
    });
  }

  public checkViewportSize(): void {
    console.log('resize')
    this.breakpointObserver
      .observe(Object.values(Breakpoints)).pipe(first())
      .subscribe((state: BreakpointState) => {
        for (const [breakpoint, label] of this.displayNameMap) {
          if (state.breakpoints[breakpoint]) {
            this.commonFacadeService.setScreenSize(label);
            break;
          }
        }
      });
  }
}
