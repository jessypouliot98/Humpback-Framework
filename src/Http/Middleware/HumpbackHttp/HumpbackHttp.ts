import Middleware from '../'
import Request from '../../Request/Request'
import Response from '../../Response/Response'
import { Request as ExpressRequest, Response as ExpressResponse, NextFunction } from 'express'

class HumpbackHttp extends Middleware {

	public static setup(req: ExpressRequest, res: ExpressResponse, next: NextFunction) {
		Request.set(req);
		Response.set(res);

		next();
	}

}

export default HumpbackHttp
