import Humpback from '../../Humpback/Humpback'
import { Request as ExpressRequest } from 'express'

class Request {

	public headers: any = {};

	constructor(request: ExpressRequest | null){
		if(!request){
			return;
		}

		this.headers = request.headers;
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

}

export default Request
