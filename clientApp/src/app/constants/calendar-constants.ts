import { WeekDay } from "@angular/common";

export class CalendarConstants {
    public static readonly CLASS_GRID_BEGINING_IN_MINUTES: number = 420;
    public static readonly MINUTES_CLASS_GRID: number = 840;
    public static readonly MINUTES_IN_HOUR: number = 60;
    public static readonly START_HOUR: number = 7;
    public static readonly PRECENT: string = '%';
    public static readonly WEEK_DAYS: string[] = [
        'Poniedziałek',
        'Wtorek',
        'Środa',
        'Czwartek',
        'Piątek',
        'Sobota',
        'Niedziela'
    ];
    public static readonly WEEK_DAYS_ORDER: Map<WeekDay, number> = new Map([
        [WeekDay.Monday, 0],
        [WeekDay.Tuesday, 1],
        [WeekDay.Wednesday, 2],
        [WeekDay.Thursday, 3],
        [WeekDay.Friday, 4],
        [WeekDay.Saturday, 5],
        [WeekDay.Sunday, 6]
    ]);
}
