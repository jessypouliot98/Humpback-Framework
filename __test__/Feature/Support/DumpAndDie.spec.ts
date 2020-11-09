import DumpAndDie from '../../../src/Support/DumpAndDie/DumpAndDie'

class Exemple {

    public __dump() {
        return 'this is an exemple dump';
    }

}

describe('Test DumpAndDie', () => {

    test('It should throw a DumpAndDie error', () => {
        const exempleInstance = new Exemple();

        try {
            DumpAndDie.call(exempleInstance);
        } catch (error) {
            expect(error instanceof DumpAndDie).toBeTruthy();
        }
    });

    test('It should contain the __dump return value in error\'s content', () => {
        const exempleInstance = new Exemple();

        try {
            DumpAndDie.call(exempleInstance);
        } catch (error) {
            expect(error.content.toString()).toBe([exempleInstance.__dump()].toString());
        }
    });

});
