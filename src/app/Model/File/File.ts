import Model from '../Model'
import * as DatabaseType from '../../../Database/Types/Types'
import * as InputType from '../../../Entities/InputTypes'

class File extends Model {

	public static collection = 'files';

	public static columns = [
		{
			name: 'title',
			type: DatabaseType.String,
			input: {
				type: InputType.TypeString,
			},
		}
	]

}

export default File
