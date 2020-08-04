import Query, { whereArgs, queryState, payload } from '../../Query/Query'

export type enumTrashed = 'with' | 'without' | 'only';

class Db {

	protected _state: queryState = {
		collection: null,
		select: '*',
		where: null,
		order: null,
		limit: null,
		offset: 0,
	}

	protected _usesSoftDeletes: boolean = false;
	protected _getTrashed: enumTrashed = 'without';

	public set useSoftDeletes(value: boolean) {
		this._usesSoftDeletes = value;
	}

	public set getTrashed(value: enumTrashed) {
		this._getTrashed = value;
	}

	protected setupTrash = () => {
		if (!this._usesSoftDeletes) {
			return;
		}

		switch(this._getTrashed){
			case 'with':
				return;

			case 'only':
				this.where(['deletedAt', '!=', null]);
				return;

			case 'without':
			default:
				this.where(['deletedAt', '=', null]);
				return;
		}
	}

	// Collection

	public collection(collection: queryState['collection']) {
		this._state.collection = collection;
		return this;
	}

	public static collection(collection: queryState['collection']) {
		return new this().collection(collection);
	}

	// Select

	// public select(select: queryState['select']) {
	// 	this._state.select = select;
	// 	return this;
	// }
	//
	// public static select(select: queryState['select']) {
	// 	return new this().select(select);
	// }

	public where(where: whereArgs) {
		if (!this._state.where) {
			this._state.where = [];
		}

		this._state.where.push(where);

		return this;
	}

	public static where(where: whereArgs) {
		return new this().where(where);
	}

	// public order(order: queryState['order']) {
	// 	this._state.order = order;
	// 	return this;
	// }
	//
	// public static order(order: queryState['order']) {
	// 	return new this().order(order);
	// }

	public limit(limit: queryState['limit']) {
		this._state.limit = limit;
		return this;
	}

	public static limit(limit: queryState['limit']) {
		return new this().limit(limit);
	}

	public offset(offset: queryState['offset']) {
		this._state.offset = offset;
		return this;
	}

	public static offset(offset: queryState['offset']) {
		return new this().offset(offset);
	}

	public async get(): Promise<any[]> {
		this.setupTrash();
		return new Query(this._state).get();
	}

	public async create(payload: payload): Promise<any> {
		this.setupTrash();
		return new Query(this._state).create(payload);
	}

	public async update(payload: payload): Promise<any> {
		this.setupTrash();
		return new Query(this._state).update(payload);
	}

	public async delete(): Promise<any> {
		this.setupTrash();
		return new Query(this._state).delete();
	}

	public async first(): Promise<any> {
		this.setupTrash();
		return new Query(this._state).first();
	}
}

export default Db
