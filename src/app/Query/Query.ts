import Humpback from '../Humpback/Humpback'
import Config from '../Config/Config'
import MongoDB from './Drivers/MongoDB/MongoDB'
import DatabaseException from '../../Exception/DatabaseException/DatabaseException'

export type enumCompare = '=' | '!=' | '>' | '<' | '>=' | '<=' | 'in' | 'notIn' | 'contains' | 'notContains' | 'regex';
export type enumOrder =  'ASC' | 'DESC';

export type whereArgs = [string, enumCompare, any];

export type queryState = {
	collection: string|null,
	select: string|string[],
	where: whereArgs[]|null,
	order: [string, enumOrder]|null,
	limit: number|null,
	offset: number,
};

export type payload = object;

class Query {

	protected _db: MongoDB|null = null;

	protected _state: queryState = {
		collection: null,
		select: '*',
		where: null,
		order: null,
		limit: 0,
		offset: 0,
	}

	constructor(state: queryState){
		this._state = { ...this._state, ...state };
	}

	protected get db(): MongoDB {
		if(this._db === null)
			throw DatabaseException.notInitialized();

		return (this._db as MongoDB);
	}

	protected async connect(): Promise<void> {
		if( Humpback.state === undefined || Humpback.state.db.connection === null ){
			this._db = await MongoDB.connect( Config.db );

			if (Humpback.state !== undefined) {
				Humpback.state.db.connection = this._db.connection;
			}
		} else {
			this._db = await MongoDB.restore( Humpback.state.db.connection, Config.db.DB_NAME );
		}
	}

	public async first(): Promise<any> {
		await this.connect();

		return this.db.first(this._state);
	}

	public async get(): Promise<any[]> {
		await this.connect();

		return this.db.get(this._state);
	}

	public async create(payload: any): Promise<any[]> {
		await this.connect();

		return this.db.create(this._state, payload);
	}

	public async update(payload: any): Promise<any[]> {
		await this.connect();

		return this.db.update(this._state, payload);
	}

	public async delete(): Promise<any[]> {
		await this.connect();

		return this.db.delete(this._state)
	}

}

export default Query;
