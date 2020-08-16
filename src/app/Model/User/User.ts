import Model from '../Model'
import * as DatabaseType from '../../../Entities/DatabaseTypes'
import * as InputType from '../../../Entities/InputTypes'

class User extends Model {

	public static collection = 'users';

	public static columns = [
		{
			name: 'userName',
			type: DatabaseType.TypeString,
			input: {
				type: InputType.TypeString,
			},
		}, {
			name: 'firstName',
			type: DatabaseType.TypeString,
			input: {
				type: InputType.TypeString,
			},
		}, {
			name: 'lastName',
			type: DatabaseType.TypeString,
			input: {
				type: InputType.TypeString,
			},
		}, {
			name: 'email',
			type: DatabaseType.TypeString,
			input: {
				type: InputType.TypeEmail,
			},
		}, {
			name: 'password',
			type: DatabaseType.TypeString,
			input: {
				type: InputType.TypePassword,
			},
		},
	]

	public static hidden = ['password'];

}

export default User
