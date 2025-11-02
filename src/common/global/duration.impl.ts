
const SECOND_MS    = 1000
const MINUTE_MS    = 60*SECOND_MS;
const HOURS_MS     = 60*MINUTE_MS;
const DAY_MS       = 24*HOURS_MS;
const MONTHS_MS    = 30*DAY_MS;
const YEAR_MS      = 365*DAY_MS;

const parseISO = (src: string): number => {
    src = src.trim().toUpperCase().replaceAll(/\s*/g,'');
    if(!src.startsWith('P'))
        src = 'P'+src;

    let result = 0;
    let match:  string | undefined, 
        value:  string | undefined, 
        suffix: string | undefined;

    const regexp = new RegExp("([0-9]*[.,]?[0-9]*)([YMDHMS])|T|P", "y");
    const nextToken  = ()=>void ([match, value, suffix] = regexp.exec(src) || []);
    const isFinished = ()=>(regexp.lastIndex === 0);

    nextToken()
    // this will never not be P
    if(match != 'P') 
        return NaN;

    nextToken()
    if(suffix === 'Y')
        void (result += parseFloat(value as string)*YEAR_MS), nextToken();
    if(suffix === 'M')
        void (result += parseFloat(value as string)*MONTHS_MS), nextToken();
    if(suffix === 'D')
        void (result += parseFloat(value as string)*DAY_MS), nextToken();
    if(isFinished()) 
        return result;
    if((match as any) != 'T')
        return NaN;
    nextToken();
    if(suffix === 'H')
        void (result += parseFloat(value as string)*HOURS_MS), nextToken();
    if(suffix === 'M')
        void (result += parseFloat(value as string)*MINUTE_MS), nextToken();
    if(suffix === 'S')
        void (result += parseFloat(value as string)*SECOND_MS);
    return result;
}

var Duration = function<T extends Object>(this: T, option?: unknown): Duration {
    if(!(this instanceof Duration)) 
        return new Duration(option as any);
    let value = 0;
    if(typeof option !== 'undefined') {
        if(typeof option === 'number') {
            value = option as number;
        } else if(typeof option === 'string') {
            value = parseISO(option)
        } else if(typeof option === 'object' && option != null) {
            const {year, month, day, hours, minute, second} = option as DurationConstructorOptions;
            value = (
                (year || 0)*YEAR_MS +
                (month || 0)*MONTHS_MS +
                (day || 0)*DAY_MS +
                (hours || 0)*HOURS_MS + 
                (minute || 0)*MINUTE_MS +
                (second || 0)*SECOND_MS
            );
        }
    }
    Object.defineProperty(this, 'value', {
        value,
        configurable: false,
        enumerable: false,
        writable: false,
    })
    return this;
} as DurationConstructor;

Duration.prototype.minus = function(this: Duration, other: Duration){
    return new Duration(+this - +other);
}
Duration.prototype.plus = function(this: Duration, other: Duration){
    return new Duration(+this - +other);
}
Duration.prototype.subTo = function(this: Duration, date: Date): Date {
    return new Date(+date - +this);
}
Duration.prototype.addTo = function(this: Duration, date: Date): Date {
    return new Date(+date + +this);
}
Duration.prototype.abs = function(this: Duration): Duration {
    return new Duration(Math.abs(+this));
}
Duration.prototype.inv = function(this: Duration): Duration {
    return new Duration(-+this);
}
Duration.prototype.valueOf = function(this: Duration & {value: number}) {
    return this.value;
}
Duration.prototype.getMilliseconds = function(this: Duration): number {
    return +this;
}
Duration.prototype.getSeconds = function(this: Duration): number {
    return (+this)/SECOND_MS;
}
Duration.prototype.getMinutes = function(this: Duration): number {
    return (+this)/MINUTE_MS;
}
Duration.prototype.getHours = function(this: Duration): number {
    return (+this)/HOURS_MS;
}
Duration.prototype.getDays = function(this: Duration): number {
    return (+this)/DAY_MS;
}
Duration.prototype.getMonths = function(this: Duration): number {
    return (+this)/MONTHS_MS;
}
Duration.prototype.getYears = function(this: Duration): number {
    return (+this)/YEAR_MS;
}

Duration.parse = function(src: string){
    return new Duration(parseISO(src));
}
Duration.between = function(a: Date, b: Date) {
    return Duration(+b - +a);
}
Object.defineProperties(Duration, {
    SECOND_MS:  {value: SECOND_MS},
    MINUTE_MS:  {value: MINUTE_MS},
    HOURS_MS:   {value: HOURS_MS},
    DAY_MS:     {value: DAY_MS},
    MONTHS_MS:  {value: MONTHS_MS},
    YEAR_MS:    {value: YEAR_MS}
})

globalThis.Duration = Duration;