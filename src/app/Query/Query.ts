import Humpback from '../Humpback/Humpback'
import Collection from '../../entities/Collection/Collection'
import BaseConfig from '../BaseConfig/BaseConfig'
import MongoDB from './drivers/MongoDB/MongoDB'
import Model from '../Model/Model'
import DatabaseException from '../../exception/DatabaseException/DatabaseException'
import { whereArgs } from './types'

export type queryState = {
	collection: string|null,
	where: whereArgs|null,
	order: any|null,
	quantity: number|null,
	page: number|null,
	with: string[],
}

class Query {

	protected _db: MongoDB|null = null;

	protected _model: any;

	protected state: queryState = {
		collection: null,
		where: null,
		order: null,
		quantity: null,
		page: null,
		with: [],
	}

	constructor(model: Model){
		this._model = model;
		this.state.collection = (model.constructor as any).collection;
	}

	protected get db(): MongoDB {
		if(this._db === null)
			throw DatabaseException.notInitialized();

		return (this._db as MongoDB);
	}

	protected async connect(): Promise<void> {
		if( Humpback.state.db.connection === null ){
			this._db = await MongoDB.connect( BaseConfig.db );
			Humpback.state.db.connection = this._db.connection;
		} else {
			this._db = await MongoDB.restore( Humpback.state.db.connection, BaseConfig.db.DB_NAME );
		}

	}

	public setWhere(args: whereArgs): void {
		this.state.where = args;
	}

	public setQuantity(qty: number): void {
		this.state.quantity = qty;
	}

	public setWith(relation: string): void {
		this.state.with.push(relation);

		this._model[relation]()().then(console.log)
	}

	// public setWith(with: string): void {
	// 	this.state.with.push(with);
	// }

	public async first(){
		await this.connect();
		const data = await this.db.first(this.state);

		return new Collection(this._model, data);
	}

	public async get(){
		await this.connect();
		const aData = await this.db.get(this.state);

		return aData.map(data => new Collection(this._model, data));
	}

}

export default Query;
