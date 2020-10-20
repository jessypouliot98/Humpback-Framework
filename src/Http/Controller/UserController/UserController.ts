import Controller from '../Controller'
import User from '../../../App/Model/User/User'
import Auth from '../../../Support/Auth/Auth'
import Hash from '../../../Support/Hash/Hash'

class UserController extends Controller {

	public async login({ body }) {
		// const user = await User
		// 	.where('email', '=', body.email)
		// 	.where('password', '=', Hash.make(body.password))
		// 	.first();

		const user = null;

		if (!user) {
			return;
		}

		return Auth.createToken(user);
	}

	public async authCheck() {
		return Auth.validateToken();
	}

	public async index() {
		return null;
		// return await User.all();
	}

	public async show({ params }) {
		return null;
		// return await User.find(params.id);
	}

	public async create({ body }) {
		return null;
		// return await User.create(body);
	}

	public async update({ params, body }) {
		return null;
		// return await User.where('id', params.id).update(body);
	}

	public async delete({ params }) {
		return null;
		// return await User.where('id', params.id).delete();
	}

}

export default UserController
