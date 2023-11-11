
import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'qz-destroyable',
  templateUrl: './destroyable.component.html',
  styleUrls: ['./destroyable.component.scss']
})
export abstract class DestroyableComponent implements OnDestroy {

  destroyed$ = new Subject();
  
  ngOnDestroy(): void {
      this.destroyed$.next(null);
      this.destroyed$.complete();
  }
}
