import Middleware from '../'
import Request from '../../Request/Request'
import Response from '../../Response/Response'
import express, { Request as ExpressRequest, Response as ExpressResponse, NextFunction } from 'express'
import DumpAndDie from '../../../Support/DumpAndDie/DumpAndDie'

class HumpbackHttp extends Middleware {

	public static setup() {
		return (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
			Request.set(req);
			Response.set(res);

			try{
				next();
			} catch(e){
				if (e instanceof DumpAndDie) {
					Response.send(e.content);
					return;
				}

				console.error(e)
				Response.send(e);
			}
		}
	}

	public static static(root: string, options?: any) {
		return express.static(root, options);
	}

}

export default HumpbackHttp
