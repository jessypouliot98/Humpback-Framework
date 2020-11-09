import Moment, {
    UNIX_EPOCH_START_TIME,
    UNIX_EPOCH_YEAR,
    UNIX_EPOCH_MONTH,
    UNIX_EPOCH_DAY,
    UNIX_EPOCH_DATE_ISO,
} from '../../../src/Support/Moment/Moment'

describe('Test Moment', () => {

    test('It should be able to get current time', () => {
        const now = Date.now();
        const moment = Moment.now().raw();

        expect(moment - now).toBeLessThanOrEqual(10);
    });


    test('It should be able to clone itself', () => {
        const moment = Moment.now();
        const clone = moment.clone();

        expect(clone.raw()).toBe(moment.raw());
    });

    test('It should be able to represent passed date', () => {
        const date = UNIX_EPOCH_START_TIME;
        const moment = Moment.unix(date);

        expect(moment.raw()).toBe(date);
    });

    test('It should be able to get unix epoch time', () => {
        const moment = Moment.unixEpochStart();

        expect(moment.toISO()).toBe(UNIX_EPOCH_DATE_ISO);
    });

});
