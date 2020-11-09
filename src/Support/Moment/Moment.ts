import moment from 'moment-timezone'

export const UNIX_EPOCH_START_TIME = 0;
export const UNIX_EPOCH_TIMEZONE = 'UTC';
export const UNIX_EPOCH_YEAR = 1970;
export const UNIX_EPOCH_MONTH = 1;
export const UNIX_EPOCH_DAY = 1;
export const UNIX_EPOCH_DATE_ISO = '1970-01-01T00:00:00.000Z';

class Moment {

    protected _value: moment.Moment;

    public static setDefaultTimezone(timezone?: string) {
        moment.tz.setDefault(timezone);
    }

    public constructor(value?: string | number | Date | moment.Moment) {
        if (value instanceof moment) {
            this._value = value as moment.Moment;
        }
        else if (typeof value == 'number') {
            this._value = moment.unix(value);
        }
        else {
            this._value = moment(value).utc();
        }
    }

    public static now() {
        return new this();
    }

    public static unix(time: number) {
        return new this(time);
    }

    public static unixEpochStart() {
        return this.unix(UNIX_EPOCH_START_TIME);
    }

    public timezone(timezone: string) {
        this._value = moment.tz(this._value.format(), timezone);

        return this;
    }

    public raw() {
        return this._value.valueOf();
    }

    public toISO() {
        return this._value.toISOString();
    }

    public format(format?: string) {
        return this._value.format(format);
    }

    public clone() {
        return new (this.constructor as typeof Moment)(this._value.clone())
    }

    public getYear() {
        return this._value.year();
    }

    public getMonth() {
        return this._value.month() + 1;
    }

    public getDay() {
        return this._value.dayOfYear();
    }

    public getHour() {
        return this._value.hour();
    }

    public getMinute() {
        return this._value.minute();
    }

    public getSecond() {
        return this._value.second();
    }

    protected add(count: moment.DurationInputArg1, unit: moment.unitOfTime.Base) {
        this._value = this._value.add(count, unit)

        return this;
    }

    public addSeconds(count: number = 1) {
        return this.add(count, 'seconds');
    }

    public addMinutes(count: number = 1) {
        return this.add(count, 'minutes');
    }

    public addHours(count: number = 1) {
        return this.add(count, 'hours');
    }

    public addDays(count: number = 1) {
        return this.add(count, 'days');
    }

    public addWeeks(count: number = 1) {
        return this.add(count, 'weeks');
    }

    public addMonths(count: number = 1) {
        return this.add(count, 'months');
    }

    public addYears(count: number = 1) {
        return this.add(count, 'years');
    }

    protected subtract(count: moment.DurationInputArg1, unit: moment.unitOfTime.Base) {
        this._value = this._value.subtract(count, unit)

        return this;
    }

    public subSeconds(count: number = 1) {
        return this.subtract(count, 'seconds');
    }

    public subMinutes(count: number = 1) {
        return this.subtract(count, 'minutes');
    }

    public subHours(count: number = 1) {
        return this.subtract(count, 'hours');
    }

    public subDays(count: number = 1) {
        return this.subtract(count, 'days');
    }

    public subWeeks(count: number = 1) {
        return this.subtract(count, 'weeks');
    }

    public subMonths(count: number = 1) {
        return this.subtract(count, 'months');
    }

    public subYears(count: number = 1) {
        return this.subtract(count, 'years');
    }

}

export default Moment
