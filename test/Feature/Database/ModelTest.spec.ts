import User from '../../../src/App/Model/User/User'

describe('Test Model', () => {
    test('It should be able to find data', async() => {
        const user = await User.query().find('sd');
    });
});
