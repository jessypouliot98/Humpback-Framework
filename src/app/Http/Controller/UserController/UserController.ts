import Controller from '../Controller'
import User from '../../../Model/User/User'

class UserController extends Controller {

	public async index() {
		return await User.all();
	}

	public async show({ params }) {
		return await User.find(params.id);
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

export default UserController
