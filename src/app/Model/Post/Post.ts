import Model from '../Model'
import File from '../File/File'

class Post extends Model {

	public static collection = 'posts';

	public static columns = {
		title: String,
		slug: String,
		excerpt: String,
		content: String,
	}

	public thumbnail(){
		return this.hasOne(File, 'thumbnail', '_id');
	}

}

export default Post
