import Controller from '../../Controller'
import User from '../../../Model/presets/User/User'
import Request from '../../../Request/Request'

class UserController extends Controller {

	public async index(): Promise<any> {
		return await new User().all().get();
	}

	public async show({ params }): Promise<any> {
		return await new User().find(params.id);
	}

	public async store(): Promise<any> {
		return 'Hello World';
	}

	public async update(): Promise<any> {
		return 'Hello World';
	}

	public async delete(): Promise<any> {
		return 'Hello World';
	}

}

export default UserController
