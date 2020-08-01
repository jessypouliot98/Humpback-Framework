import Controller from '../Controller'
import Page from '../../../Model/Page/Page'

class PageController extends Controller {

	public async index() {
		return await Page.all();
	}

	public async show({ params }) {
		return await Page.find(params.id);
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
