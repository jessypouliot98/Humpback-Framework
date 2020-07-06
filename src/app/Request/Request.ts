import Humpback from '../Humpback/Humpback'
import Collection from '../../entities/Collection/Collection'

class Request {

	protected _resolve: any;

	public headers: any = {};
	// public url: string = '';

	constructor(request?: any, resolve?: any){
		if( request == undefined || resolve == undefined ){
			return;
		}

		Object.defineProperty(this, '_resolve', { enumerable: false, value: resolve });
		this.headers = request.headers;
	}

	public static get current(): Request {
		return Humpback.state.http.request || new this(null, null);
	}

	public static set(request: any, resolve: any): void {
		Humpback.state.http.request = new this(request, resolve);
	}

	public get ip(): string {
		return this.headers.host;
	}

	public get userAgent(): string {
		return this.headers['user-agent'];
	}

	public get bearerToken(): string|null {
		return this.headers.bearer || null;
	}

	// Resolve

	public resolve(mode: string, data: any): void {
		if( data instanceof Collection ){
			data = data.entries;
		}

		this._resolve[mode](data);
	}

	public send(data: any): void {
		this.resolve('send', data);
	}

	public static send(data: any): void {
		Request.current.send(data);
	}

	public json(data: any): void {
		this.resolve('json', data);
	}

	public static json(data: any): void {
		Request.current.json(data);
	}

}

export default Request
