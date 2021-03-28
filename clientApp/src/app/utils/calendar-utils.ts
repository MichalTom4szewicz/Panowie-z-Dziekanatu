import { Time } from "@angular/common";
import { CalendarConstants } from "../components/constants/calendar-constants";

export class CalendarUtils {

    public static getTimeInMinutes(time: Time): number {
        return time.hours * CalendarConstants.MINUTES_IN_HOUR + time.minutes;
    }

    public static getFullHour(hour: number): string {
        return this.getTwoDigitTime(hour) + ":00";
    }

    public static getTime(time: Time): string {
        return this.getTwoDigitTime(time.hours) + ":" + this.getTwoDigitTime(time.minutes);
    }

    private static getTwoDigitTime(time: number) {
        return time.toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false
        });
    }
}