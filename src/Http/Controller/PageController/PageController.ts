import Controller from '../Controller'
import Page from '../../../App/Model/Page/Page'

class PageController extends Controller {

	public async index() {
		return null;
		// return await Page.all();
	}

	public async show({ params }) {
		return null;
		// return await Page.find(params.id);
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

export default PageController
