import Model from '../../App/Model/Model'

class Factory {

	protected _model: typeof Model;
	protected _count: number;

	public static call(model: typeof Model, count: number = 1) {
		return new this(model, count);
	}

	public constructor(model: typeof Model, count: number = 1) {
		this._model = model;
		this._count = count;
	}

	public async create(payload: object) {
		const store: any[] = [];

		for (let i = 0; i < this._count; i++) {
			const model = await this._model.create(payload);

			store.push(model);
		}

		return store.length;
	}

}

export default Factory
