import { Injectable } from '@angular/core';


@Injectable({
    providedIn: 'root',
})
export class TimeService {
    public getTimeDifferenceInSeconds(startTime: number, seconds: number): number {
        const endTime = new Date().getTime();
        const timeDifferenceInMilliseconds = (endTime - seconds * 1000) - startTime;
        const timeDifferenceInSeconds = Math.round(timeDifferenceInMilliseconds / 1000) * -1;
        if (timeDifferenceInSeconds >= 0 && timeDifferenceInSeconds <= seconds) {
            return timeDifferenceInSeconds;
        } else {
            return 0;
        }
    }

}