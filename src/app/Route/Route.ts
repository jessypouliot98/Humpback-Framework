import express from 'express'

class Route {

	public router: any = express.Router();

	protected serve(method: string, route: string, delegate: any): any {
		return this.router[method](route, async (req: any, res: any) => {
			let data: any;

			if( Array.isArray(delegate) && delegate.length === 2 ){
				const [controller, func] = delegate;
				data = await new controller()[func](req);
			}
			else if( typeof delegate === 'function' ){
				data = await delegate(req);
			}

			res.send(data);
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
