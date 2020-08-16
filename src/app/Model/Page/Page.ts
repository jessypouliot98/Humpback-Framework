import Model from '../Model'
import * as DatabaseType from '../../../Entities/DatabaseTypes'
import * as InputType from '../../../Entities/InputTypes'

class Page extends Model {

	public static collection = 'pages';

	public static columns = [
		{
			name: 'title',
			type: DatabaseType.TypeString,
			input: {
				type: InputType.TypeString,
			},
		}, {
			name: 'slug',
			type: DatabaseType.TypeString,
			input: {
				type: InputType.TypeString,
			},
		},{
			name: 'excerpt',
			type: DatabaseType.TypeString,
			input: {
				type: InputType.TypeString,
			},
		},{
			name: 'content',
			type: DatabaseType.TypeObject,
			input: {
				type: InputType.TypeString,
			},
		},
	]

}

export default Page
