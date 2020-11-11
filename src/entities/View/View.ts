export type viewEngines = 'ejs' | 'none'

export const VIEW_INITIAL_DATA = '__BOWHEAD_INITIAL_DATA__';

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

	public static scriptRaw(content = '') {
		return `<script>${content}</script>`;
	}

	public static scriptSrc(src: string) {
		console.log(src)
		return `<script src="${src}" defer></script>`;
	}

	public static scriptData(payload: any, scope: string = VIEW_INITIAL_DATA) {
		const globalVar = `window.${scope}`;
		const value = JSON.stringify(payload);

		return this.scriptRaw(`${globalVar} = ${value};`);
	}

}

export default View
