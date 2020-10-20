export enum viewEngines {
	ejs = 'ejs',
	null = 'null',
};

class View extends String {

	protected _payload?: object;

	constructor(view: string, payload?: object) {
		super(view);

		this._payload = payload;
	}

	public get payload() {
		return this._payload;
	}

	public static render(view: string, payload?: object) {
		return new this(view, payload);
	}

}

export default View
