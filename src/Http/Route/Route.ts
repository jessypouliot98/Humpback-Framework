import express, { Request as ExpressRequest, Response as ExpressResponse } from 'express'
import Request from '../Request/Request'
import Response from '../Response/Response'
import NoSuchMethodException from '../../Exception/NoSuchMethodException/NoSuchMethodException'
import DumpAndDie from '../../Support/DumpAndDie/DumpAndDie'

export type enumServeMethods = 'get' | 'post' | 'put' | 'patch' | 'delete';

class Route {

	public router: express.Router = express.Router();

	protected serve(method: enumServeMethods, route: string, delegate: any): any {
		return this.router[method](route, async(req: ExpressRequest) => {
			Request.set(req);
			try{
				let data: any;

				if( Array.isArray(delegate) && delegate.length === 2 ){
					const [controller, func] = delegate;

					const conrollerInstance = new controller();

					if( typeof conrollerInstance[func] !== 'function' ) {
						throw NoSuchMethodException.routeDelegate();
					}

					data = await conrollerInstance[func](Request.current);
				}
				else if( typeof delegate === 'function' ){
					data = await delegate(Request.current);
				}
				else {
					throw NoSuchMethodException.routeDelegate();
				}

				Response.send(data);
			} catch(e){
				if (e instanceof DumpAndDie) {
					Response.send(e.content);
					return;
				}

				console.error(e)
				Response.send(e);
			}
		})
	}

	protected use(a: any, b: any): any {
		if( b ){
			const route: string|string[] = a;
			const delegate: any = b;

			return this.router.use(route, delegate);
		}
		else {
			const delegate: any = a;

			return this.router.use(delegate);
		}
	}

	protected group(route: string, delegate: Function): any {
		return this.router.use(route, delegate as any);
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
		return new this().group(route, delegate);
	}

	public middleware(a: any, b: any): any {
		return this.use(a, b);
	}

	public static middleware(a: any, b: any): any {
		return new this().use(a, b);
	}

}

export default Route
