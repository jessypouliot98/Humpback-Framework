import Controller from '../Controller'
import User from '../../../Model/User/User'
import Request from '../../Request/Request'

class UserController extends Controller {

	public async index() {
		return await User.all();
	}

	public async show({ params }) {
		return await User.find(params.id);
	}

	public async create({ body }) {
			return await User.create(body);
	}

	public async update() {
		return 'Hello World';
	}

	public async delete({ params }) {
		const user = await User.find(params.id);

		if (!user) {
			return;
		}

		return user.forceDelete();
	}

}

export default UserController
