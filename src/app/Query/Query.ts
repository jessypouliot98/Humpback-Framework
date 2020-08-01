import Humpback from '../Humpback/Humpback'
import Collection from '../../Entities/Collection/Collection'
import Config from '../Config/Config'
import MongoDB from './Drivers/MongoDB/MongoDB'
import Model from '../Model/Model'
import DatabaseException from '../../Exception/DatabaseException/DatabaseException'
import { whereArgs } from './types'

export type queryState = {
	collection: string|null,
	// where: whereArgs|null,
	// order: any|null,
	// quantity: number|null,
	// page: number|null,
	// with: string[],
}

class Query {

	protected _db: MongoDB|null = null;

	protected _state: queryState = {
		collection: null,
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
		if( Humpback.state.db.connection === null ){
			this._db = await MongoDB.connect( Config.db );
			Humpback.state.db.connection = this._db.connection;
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

	public async create(): Promise<any[]> {
		await this.connect();

		return this.db.get(this._state);
	}

	public async update(): Promise<any[]> {
		await this.connect();

		return this.db.get(this._state);
	}

	public async delete(): Promise<any[]> {
		await this.connect();

		return this.db.get(this._state);
	}

}

export default Query;
