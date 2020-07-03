import User from '../Model/presets/User/User'

class Auth {

	public static user(): User {
		return new User();
	}

}

export default Auth
