import Hash from '../../../src/Support/Hash/Hash'

const SALT = 'exempleSalt';
const TEST_STRING = 'exempleString';

beforeAll(() => {
    Hash.SALT = SALT;
});

describe('Test Hash', () => {

    test('It should be able to hash a string', () => {
        expect(Hash.make(TEST_STRING)).not.toBe(TEST_STRING);
    });

});
