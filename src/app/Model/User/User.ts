import Model from '../Model'

class User extends Model {

	public static collection = 'users';

	public static columns = {
		userName: String,
		firstName: String,
		lastName: String,
		email: String,
		password: String,
	}

	public static hidden = ['password'];

}

export default User
