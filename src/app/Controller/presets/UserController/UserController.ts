import Controller from '../../Controller'

class UserController extends Controller {

	public async store(): Promise<any> {
		console.log(this.request);
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
