import Controller from '../../Controller'
import Request from '../../../Request/Request'

class UserController extends Controller {

	public async store(): Promise<any> {
		console.log(Request.current);
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
