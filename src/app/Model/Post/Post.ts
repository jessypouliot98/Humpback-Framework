import Model from '../Model'
import File from '../File/File'
import * as DatabaseType from '../../../Database/Types/Types'
import * as InputType from '../../../Entities/InputTypes'

class Post extends Model {

	public static collection = 'posts';

	public static columns = [
		{
			name: 'title',
			type: DatabaseType.String,
			input: {
				type: InputType.TypeString
			},
		}, {
			name: 'slug',
			type: DatabaseType.String,
			input: {
				type: InputType.TypeString
			},
		},{
			name: 'excerpt',
			type: DatabaseType.String,
			input: {
				type: InputType.TypeString
			},
		},{
			name: 'content',
			type: DatabaseType.Object,
			input: {
				type: InputType.TypeString
			},
		},
	]

	// public thumbnail(){
	// 	return this.hasOne(File, 'thumbnail', '_id');
	// }

}

export default Post
