declare global {
    var Duration: DurationConstructor;
}
declare interface DurationConstructorOptions {
    year?: number,
    month?: number,
    day?: number,
    hours?: number,
    minute?: number,
    second?: number
}
declare interface Duration {
    minus(duration: Duration): Duration
    plus(duration: Duration): Duration

    subTo(date: Date): Date
    addTo(date: Date): Date

    abs(): Duration
    inv(): Duration

    getMilliseconds(): number;
    getSeconds(): number;
    getMinutes(): number;
    getHours(): number;
    getDays(): number;
    getMonths(): number;
    getYears(): number;

    formatISO(): string;
    toString(): string;
    valueOf(): number;
}
declare interface DurationConstructor {
    new(): Duration
    new(isoFormat: string): Duration
    new(value: number): Duration
    new(options: DurationConstructorOptions): Duration
    (): Duration
    (isoFormat: string): Duration
    (value: number): Duration
    (options: DurationConstructorOptions): Duration
    parse(src: string): Duration
    between(a: Date, b: Date): Duration
    readonly SECOND_MS: 1_000;
    readonly MINUTE_MS: 60_000;
    readonly HOURS_MS: 3_600_000;
    readonly DAY_MS: 86_400_000;
    readonly MONTHS_MS: 2_592_000_000;
    readonly YEAR_MS: 31_536_000_000;
}

declare var Duration: DurationConstructor;