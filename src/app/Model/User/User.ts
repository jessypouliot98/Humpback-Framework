import Model, { defineColumn } from '../Model'
import Hash from '../../../Support/Hash/Hash'
import * as DatabaseType from '../../../Database/Types/Types'

function passwordFilter(value: unknown): string | null {
	if (typeof value !== 'string') {
		return null;
	}

	return Hash.make(value);
}

class User extends Model {

	public static collection = 'users';

	@defineColumn({ type: DatabaseType.Id })
	public id?: string;

	@defineColumn({ type: DatabaseType.String })
	public userName?: string;

	@defineColumn({ type: DatabaseType.String })
	public firstName?: string;

	@defineColumn({ type: DatabaseType.String })
	public lastName?: string;

	@defineColumn({ type: DatabaseType.String })
	public email?: string;

	@defineColumn({ type: DatabaseType.String, filter: passwordFilter })
	public password?: string;

}

export default User
