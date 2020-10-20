import Humpback from '../../App/Humpback/Humpback'
import { Request as ExpressRequest } from 'express'

class Request {

	protected _raw?: ExpressRequest;
	public headers: any = {};
	public params: any = {};
	public body: any = {};

	constructor(request: ExpressRequest | null){
		if(!request){
			return;
		}

		Object.defineProperty(this, '_raw', {
			value: request,
			enumerable: false,
		});

		this.headers = request.headers;
		this.params = request.params;
		this.body = request.body;
	}

	public static get current(): Request {
		return Humpback.state.http.request || new this(null);
	}

	public static set(request: any): void {
		Humpback.state.http.request = new this(request);
	}

	public get ip(): string {
		return this.headers.host;
	}

	public get userAgent(): string {
		return this.headers['user-agent'];
	}

	public get bearerToken(): string|null {
		return this.headers?.authorization || null;
	}

	public getRaw(): ExpressRequest | null {
		return this._raw || null;
	}

}

export default Request
