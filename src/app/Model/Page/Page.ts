import Model from '../Model'
import * as DatabaseType from '../../../Database/Types/Types'
import * as InputType from '../../../Entities/InputTypes'

class Page extends Model {

	public static collection = 'pages';

	public static columns = [
		{
			name: 'title',
			type: DatabaseType.String,
			input: {
				type: InputType.TypeString,
			},
		}, {
			name: 'slug',
			type: DatabaseType.String,
			input: {
				type: InputType.TypeString,
			},
		},{
			name: 'excerpt',
			type: DatabaseType.String,
			input: {
				type: InputType.TypeString,
			},
		},{
			name: 'content',
			type: DatabaseType.Object,
			input: {
				type: InputType.TypeString,
			},
		},
	]

}

export default Page
