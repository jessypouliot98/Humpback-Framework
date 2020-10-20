import Humpback from '../../App/Humpback/Humpback'
import View from '../../Entities/View/View'
import { Response as ExpressResponse } from 'express'

class Response {

	protected _response?: ExpressResponse;

	constructor(response: ExpressResponse | null){
		if(!response){
			return;
		}

		Object.defineProperty(this, '_response', { enumerable: false, value: response });
	}

	public static get current(): Response {
		return Humpback.state.http.response || new this(null);
	}

	public static set(response: any): void {
		Humpback.state.http.response = new this(response);
	}

	protected get res(): ExpressResponse {
		if (!this._response) {
			throw new Error('TODO');
		}

		return this._response;
	}

	public respond(mode: string, data: any): void {
		this.res[mode](data);
	}

	public render(view: View): void {
		this.res.render(view.toString(), view.payload);
	}

	public send(data: any): void {
		if (data instanceof View) {
			return this.render(data);
		}

		this.respond('send', data);
	}

	public static send(data: any): void {
		Response.current.send(data);
	}

	public json(data: any): void {
		this.respond('json', data);
	}

	public static json(data: any): void {
		Response.current.json(data);
	}

	public view(view: View) {
		this.respond('render', view);
	}

	public static view(view: View) {
		Response.current.view(view);
	}

}

export default Response
