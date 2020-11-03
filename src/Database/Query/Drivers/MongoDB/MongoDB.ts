import { MongoClient, ObjectID, Db, FilterQuery } from 'mongodb'
import NullException from '../../../../Exception/NullException/NullException'
import { whereArgs, queryState, enumOrder } from '../../Query'
import { connectionArgs } from '../../types'

export type mongoState = {
	collection: string,
	select: string|string[],
	where: FilterQuery<any>,
	order: [string, enumOrder] | null,
	limit: number,
	offset: number,
};

class MongoDB {

	protected _db: Db
	public connection: MongoClient

	constructor(connection: MongoClient, dbName: string){
		this.connection = connection;
		this._db = connection.db(dbName);
	}

	public static async connect({ DB_HOST, DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD }: connectionArgs): Promise<MongoDB> {
		try{
			const auth = (DB_USERNAME && DB_PASSWORD) ? `${DB_USERNAME}:${DB_PASSWORD}@` : '';
			// const url = `mongodb://${auth}${DB_HOST}:${DB_PORT}/${DB_NAME}`;
			const url = `mongodb://${auth}${DB_HOST}:${DB_PORT}`;
			const args = { useNewUrlParser: true, useUnifiedTopology: true };

			const connection = await MongoClient.connect(url, args);

			return new this(connection, DB_NAME);
		}
		catch(err) {
			throw err;
		}
	}

	public static async restore(connection: MongoClient, dbName: string): Promise<MongoDB> {
		return new this(connection, dbName);
	}

	public static async disconnect(connection: MongoClient) {
		connection.close();
	}

	public async disconnect() {
		this.constructor().disconnect(this.connection);
	}

	public async first(args: queryState): Promise<any> {
		const { collection, where } = this.parseQueryState(args);

		if( collection === null ){
			throw NullException.noValueFor('collection', 'string');
		}

		return await this._db.collection(collection).findOne(where);
	}

	public async get(args: queryState): Promise<any[]> {
		const { collection, where, limit, offset, order } = this.parseQueryState(args);

		if( collection === null ){
			throw NullException.noValueFor('collection', 'string');
		}

		let query = this._db.collection(collection).find(where);

		if (order) {
			query = query.sort(order);
		}

		if (limit) {
			query = query.limit(limit);
		}

		if (offset) {
			query = query.skip(offset);
		}

		return await query.toArray();
	}

	public async create(args: queryState, payload: any): Promise<any> {
		const { collection } = this.parseQueryState(args);

		if( collection === null ){
			throw NullException.noValueFor('collection', 'string');
		}

		return this._db.collection(collection).insertOne(payload);
	}

	public async update(args: queryState, payload: any): Promise<any> {
		const { collection, where } = this.parseQueryState(args);

		if( collection === null ){
			throw NullException.noValueFor('collection', 'string');
		}

		return this._db.collection( collection ).updateMany(where, { $set: payload });
	}

	public async delete(args: queryState): Promise<any> {
		const { collection, where } = this.parseQueryState(args);

		if( collection === null ){
			throw NullException.noValueFor('collection', 'string');
		}

		return this._db.collection( collection ).deleteMany(where);
	}

}

export default MongoDB
