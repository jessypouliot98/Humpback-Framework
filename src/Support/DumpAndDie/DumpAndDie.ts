class DumpAndDie extends Error {

	protected _body: any;

	public static call(...params: any) {
		throw new this(...params);
	}

	public constructor(...params) {
		super('Dump and Die');

		this._body = params;
	}

	protected getFunctionParams(func: () => any | Function) {
		let str = func.toString();

		str = str.replace(/\/\*[\s\S]*?\*\//g, '')
			.replace(/\/\/(.)*/g, '')
			.replace(/{[\s\S]*}/, '')
			.replace(/=>/g, '')
			.trim();

		const start = str.indexOf("(") + 1;

		const end = str.length - 1;

		const result = str.substring(start, end).split(", ");

		const params: any[] = [];

		result.forEach((element: any) => {
			element = element.replace(/=[\s\S]*/g, '').trim();

			if (element.length > 0) {
				params.push(element);
			}
		});

		return params;
	}

	public get content(): object {
		return this._body.map((body: any) => {
			if (typeof body.__dump === 'function') {
				return body.__dump();
			}

			switch (typeof body) {
				case 'function':
					return {
						function: {
							name: body.name,
							params: this.getFunctionParams(body),
							body: body.toString().split('\n'),
						}
					};
			}

			return body;
		});
	}

}

export default DumpAndDie
