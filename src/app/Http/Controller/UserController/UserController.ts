import Controller from '../Controller'
import User from '../../../Model/User/User'

class UserController extends Controller {

	public async index() {
		return await User.offset(1).all();
	}

	public async show({ params }) {
		return await User.find(params.id);
	}

	public async create({ body }) {
		return await User.create(body);
	}

	public async update({ params, body }) {
		return await User.where('id', params.id).update(body);
	}

	public async delete({ params }) {
		return await User.where('id', params.id).delete();
	}

}

export default UserController
