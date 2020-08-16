import Model from '../Model'
import File from '../File/File'
import * as DatabaseType from '../../../Entities/DatabaseTypes'
import * as InputType from '../../../Entities/InputTypes'

class Post extends Model {

	public static collection = 'posts';

	public static columns = [
		{
			name: 'title',
			type: DatabaseType.TypeString,
			input: {
				type: InputType.TypeString
			},
		}, {
			name: 'slug',
			type: DatabaseType.TypeString,
			input: {
				type: InputType.TypeString
			},
		},{
			name: 'excerpt',
			type: DatabaseType.TypeString,
			input: {
				type: InputType.TypeString
			},
		},{
			name: 'content',
			type: DatabaseType.TypeObject,
			input: {
				type: InputType.TypeString
			},
		},
	]

	public thumbnail(){
		return this.hasOne(File, 'thumbnail', '_id');
	}

}

export default Post
