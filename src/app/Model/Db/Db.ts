import Query from '../../Query/Query'

export type enumCompare = '=' | '/=' | '>' | '<' | '>=' | '<=' | 'in' | 'notIn';
export type enumOrder =  'ASC' | 'DESC';

export type DBState = {
	collection: string|null,
	select: string|string[],
	where: [string, enumCompare, any]|null,
	order: [string, enumOrder]|null,
	limit: number,
	offset: number,
	payload: object|null,
};

class Db {

	protected _state: DBState = {
		collection: null,
		select: '*',
		where: null,
		order: null,
		limit: 0,
		offset: 0,
		payload: null,
	}

	// Collection

	public collection(collection: DBState['collection']) {
		this._state.collection = collection;
		return this;
	}

	public static collection(collection: DBState['collection']) {
		return new this().collection(collection);
	}

	// Select

	public select(select: DBState['select']) {
		this._state.select = select;
		return this;
	}

	public static select(select: DBState['select']) {
		return new this().select(select);
	}

	public where(where: DBState['where']) {
		this._state.where = where;
		return this;
	}

	public static where(where: DBState['where']) {
		return new this().where(where);
	}

	public order(order: DBState['order']) {
		this._state.order = order;
		return this;
	}

	public static order(order: DBState['order']) {
		return new this().order(order);
	}

	public limit(limit: DBState['limit']) {
		this._state.limit = limit;
		return this;
	}

	public static limit(limit: DBState['limit']) {
		return new this().limit(limit);
	}

	public offset(offset: DBState['offset']) {
		this._state.offset = offset;
		return this;
	}

	public static offset(offset: DBState['offset']) {
		return new this().offset(offset);
	}

	public async get(): Promise<any[]> {
		return new Query({ collection: this._state.collection }).get();
	}

	public async create(payload: any): Promise<any> {
		return new Query({ collection: this._state.collection }).create();
	}

	public async update(payload: any): Promise<any> {
		return new Query({ collection: this._state.collection }).update();
	}

	public async delete(): Promise<any> {
		return new Query({ collection: this._state.collection }).delete();
	}

	public async first(): Promise<any> {
		return new Query({ collection: this._state.collection }).first();
	}
}

export default Db
