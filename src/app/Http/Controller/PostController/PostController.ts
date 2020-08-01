import Controller from '../Controller'
import Post from '../../../Model/Post/Post'

class PostController extends Controller {

	public async index() {
		return await Post.all();
	}

	public async show({ params }) {
		return await Post.find(params.id);
	}

	public async store() {
		return 'Hello World';
	}

	public async update() {
		return 'Hello World';
	}

	public async delete() {
		return 'Hello World';
	}

}

export default PostController
