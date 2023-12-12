import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TimeService } from 'src/app/services/time.service';
import { DestroyableComponent } from 'src/app/utils/destroyable/destroyable.component';

@Component({
    selector: 'qz-timer',
    templateUrl: './timer.component.html',
    styleUrls: ['./timer.component.scss']
})
export class TimerComponent extends DestroyableComponent {
    private countdownSubscription!: Subscription;
    public remainingTime: number = 0;
    @Output() timeIsUp: EventEmitter<void> = new EventEmitter();
    @Input() set time(value: { timeStamp: number, seconds: number }) {
        if (value) {
            const { timeStamp, seconds } = value;

            const remainingSeconds = this.timeService.getTimeDifferenceInSeconds(timeStamp, seconds);
            if (remainingSeconds > 0) {
                this.setInterval(remainingSeconds);
            }
        }
    }
    constructor(private timeService: TimeService) {
        super();
    }

    private setInterval(remainingSeconds: number): void {
        this.cancelCountdown();
        this.countdownSubscription = interval(1000)
            .pipe(takeUntil(this.destroyed$))
            .subscribe((value) => {
                this.remainingTime = remainingSeconds - value;
                if (this.remainingTime <= 0) {
                    this.timeIsUp.emit();
                    this.cancelCountdown();
                }
            });
    }

    private cancelCountdown(): void {
        if (this.countdownSubscription) {
            this.countdownSubscription.unsubscribe();
        }
    }
}
