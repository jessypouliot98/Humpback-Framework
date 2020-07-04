import express from 'express'
import Request from '../Request/Request'
import NoSuchMethodException from '../../exception/NoSuchMethodException/NoSuchMethodException'

class Route {

	public router: any = express.Router();

	protected serve(method: string, route: string, delegate: any): any {
		return this.router[method](route, async (req: any, res: any) => {
			Request.set(req, res);
			try{
				let data: any;

				if( Array.isArray(delegate) && delegate.length === 2 ){

					const [controller, func] = delegate;
					const conrollerInstance = new controller();

					if( typeof conrollerInstance[func] !== 'function' ) {
						throw NoSuchMethodException.routeDelegate();
					}

					data = await conrollerInstance[func](req);
				} else if( typeof delegate === 'function' ){

					data = await delegate(req);
				} else {

					throw NoSuchMethodException.routeDelegate();
				}

				res.send(data);
			} catch(e){
				console.error(e)
				res.send(e);
			}
		})
	}

	protected use(delegate: any): any {
		return this.router.use(delegate);
	}

	protected group(route: string, delegate: Function): any {
		return this.router.use(route, delegate);
	}

	public get(route: string, delegate: any): any {
		return this.serve('get', route, delegate);
	}

	public static get(route: string, delegate: any): any {
		return new this().get(route, delegate);
	}

	public post(route: string, delegate: any): any {
		return this.serve('post', route, delegate);
	}

	public static post(route: string, delegate: any): any {
		return new this().post(route, delegate);
	}

	public put(route: string, delegate: any): any {
		return this.serve('put', route, delegate);
	}

	public static put(route: string, delegate: any): any {
		return new this().put(route, delegate);
	}

	public patch(route: string, delegate: any): any {
		return this.serve('patch', route, delegate);
	}

	public static patch(route: string, delegate: any): any {
		return new this().patch(route, delegate);
	}

	public delete(route: string, delegate: any): any {
		return this.serve('delete', route, delegate);
	}

	public static delete(route: string, delegate: any): any {
		return new this().delete(route, delegate);
	}

	public prefix(route: string, delegate: any): any {
		return this.group(route, delegate);
	}

	public static prefix(route: string, delegate: any): any {
		console.log(0, this)
		return new this().group(route, delegate);
	}

	public middleware(delegate: any): any {
		return this.use(delegate);
	}

	public static middleware(delegate: any): any {
		return new this().use(delegate);
	}

}

export default Route
