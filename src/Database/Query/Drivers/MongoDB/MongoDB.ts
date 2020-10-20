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

	protected parseQueryState(args: queryState): mongoState {
		const parsedArgs: any = Object.keys({...args}).reduce((acc, key) => {
			let prop = args[key];

			if ( prop === null ) {
				return acc;
			}

			switch(key){

				case 'where':
					const formatWhere = (where: whereArgs) => {
						if (['id', '_id'].includes(where[0])) {
							where[0] = '_id';
							where[2] = new ObjectID(where[2]);
						}

						switch(where[1]){
							case '=':
								return { [where[0]]: where[2] };

							case '!=':
								return { [where[0]]: { $ne: where[2], $exists: true } }

							case 'in':
								return { [where[0]]: { $in: where[2], $exists: true } }

							case 'notIn':
								return { [where[0]]: { $nin: where[2], $exists: true } }

							case 'contains':
								return { [where[0]]: { $regex: `.*${where[2]}.*`, $exists: true } }

							case 'notContains':
								return { [where[0]]: { $not: { $regex: `.*${where[2]}.*` }, $exists: true } }

							case 'regex':
								return { [where[0]]: { $regex: where[2], $exists: true } }

							case '>=':
								return { [where[0]]: { $gte: where[2], $exists: true } }

							case '>':
								return { [where[0]]: { $gt: where[2], $exists: true } }

							case '<=':
								return { [where[0]]: { $lte: where[2], $exists: true } }

							case '<':
								return { [where[0]]: { $lt: where[2], $exists: true } }

							default:
								throw new Error(where[1] + ' is not a valid operator')
						}
					}

					if (prop.length > 1) {
						acc[key] = {
							$and: prop.map(formatWhere)
						}
					} else {
						acc[key] = formatWhere(prop[0]);
					}
					break;

				default:
					acc[key] = prop;
					break;

			}

			return acc;
		}, {});

		return (parsedArgs as mongoState);
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

		console.log(where);

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
