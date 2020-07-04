import Humpback from '../Humpback/Humpback'

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

}

export default Request
