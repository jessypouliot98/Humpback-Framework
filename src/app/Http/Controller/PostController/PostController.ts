import Controller from '../Controller'
import Post from '../../../Model/Post/Post'

class PostController extends Controller {

	public async index() {
		return await new Post().all().with(['thumbnail']).get();
	}

	public async show({ params }) {
		return await new Post().find(params.id);
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
