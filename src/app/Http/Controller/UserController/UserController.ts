import Controller from '../Controller'
import User from '../../../Model/User/User'
import Auth from '../../../Auth/Auth'
import Hash from '../../../Hash/Hash'

class UserController extends Controller {

	public async login({ body }) {
		const user = await User
			.where('email', '=', body.email)
			.where('password', '=', Hash.make(body.password))
			.first();

		if (!user) {
			return;
		}

		return Auth.createToken(user);
	}

	public async authCheck() {
		return Auth.validateToken();
	}

	public async index() {
		return await User.all();
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
