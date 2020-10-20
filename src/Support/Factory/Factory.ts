import Model from '../../App/Model/Model'

class Factory {

	protected _model: Model;
	protected _count: number;

	public static call(model: Model, count: number = 1) {
		return new this(model, count);
	}

	public constructor(model: Model, count: number = 1) {
		this._model = model;
		this._count = count;
	}

	public async create(payload: any) {
		const store: any[] = [];

		for (let i = 0; i < this._count; i++) {

			const model = new (this._model as any)();
			const created = await model.create(payload);

			store.push(created);
		}

		return store.length;
	}

}

export default Factory
