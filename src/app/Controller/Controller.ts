import Request from '../Request/Request'

abstract class Controller {

	protected request: Request = Request.current;

}

export default Controller
