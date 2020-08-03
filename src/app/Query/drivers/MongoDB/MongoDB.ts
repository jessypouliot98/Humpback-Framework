import { MongoClient, ObjectID, Db, FilterQuery } from 'mongodb'
import NullException from '../../../../Exception/NullException/NullException'
import { queryState, enumOrder } from '../../Query'
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
			const url = `mongodb://${auth}${DB_HOST}:${DB_PORT}/${DB_NAME}`;
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
					if (['id', '_id'].includes(prop[0])) {
						prop[0] = '_id';
						prop[2] = new ObjectID(prop[2]);
					}
					acc[key] = { [prop[0]]: prop[2] };
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
		const parsedArgs = this.parseQueryState(args);

		const collection = parsedArgs.collection;
		const where = parsedArgs.where;

		let query: any;

		if( collection === null ){
			throw NullException.noValueFor('collection', 'string');
		}

		query = this._db.collection( collection );

		return await query.findOne( where );
	}

	public async get(args: queryState): Promise<any[]> {
		const parsedArgs = this.parseQueryState(args);

		const collection = parsedArgs.collection;
		const where = parsedArgs.where;
		const order = parsedArgs.order;

		let query: any;

		if( collection === null ){
			throw NullException.noValueFor('collection', 'string');
		}

		query = this._db.collection( collection );

		query = await query.find(where);

		if ( order ) {
			query = await query.sort( order );
		}

		return await query.toArray();
	}

	public async insert(args: queryState, payload: any): Promise<any[]> {
		const parsedArgs = this.parseQueryState(args);

		const collection = parsedArgs.collection;

		let query: any;

		if( collection === null ){
			throw NullException.noValueFor('collection', 'string');
		}

		query = this._db.collection( collection );

		return query.insertOne(payload);
	}

	public async delete(args: queryState): Promise<any> {
		const parsedArgs = this.parseQueryState(args);

		const collection = parsedArgs.collection;
		const where = parsedArgs.where;

		if( collection === null ){
			throw NullException.noValueFor('collection', 'string');
		}

		console.log(where)
		return this._db.collection( collection ).deleteMany(where);
	}

}

export default MongoDB
