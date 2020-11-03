import User from '../src/App/Model/User/User'

(async () => {
    const user = await User.query().find('5f28b9e559cd370260169065');

    console.log(user);
})()
