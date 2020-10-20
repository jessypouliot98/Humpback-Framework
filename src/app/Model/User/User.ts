import Model from '../Model'
import * as DatabaseType from '../../../Database/Types/Types'
import * as InputType from '../../../Entities/InputTypes'

class User extends Model {

	public static collection = 'users';

	public static columns = [
		{
			name: 'userName',
			type: DatabaseType.String,
			input: {
				type: InputType.TypeString,
			},
		}, {
			name: 'firstName',
			type: DatabaseType.String,
			input: {
				type: InputType.TypeString,
			},
		}, {
			name: 'lastName',
			type: DatabaseType.String,
			input: {
				type: InputType.TypeString,
			},
		}, {
			name: 'email',
			type: DatabaseType.String,
			input: {
				type: InputType.TypeEmail,
			},
		}, {
			name: 'password',
			type: DatabaseType.String,
			input: {
				type: InputType.TypePassword,
			},
		},
	]

	public static hidden = ['password'];

}

export default User
