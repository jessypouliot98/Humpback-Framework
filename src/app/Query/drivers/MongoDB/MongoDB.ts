import { MongoClient, ObjectID, Db } from 'mongodb'
import NullException from '../../../../exception/NullException/NullException'
import { queryState } from '../../Query'
import { connectionArgs } from '../../types'

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

	protected parseQueryState(args: queryState): queryState {
		const parsedArgs: any = Object.keys({...args}).reduce((acc, key) => {
			let prop = args[key];
			
			if( prop === null ) return acc;

			if(prop?.field === '_id'){
				prop.value = new ObjectID(prop.value);
			}

			switch(key){

				case 'where':
					// TODO prop.condition
					acc[key] = { [prop.field]: prop.value };
					break;

				case 'order':
				default:
					acc[key] = prop;
					break;

			}

			return acc;
		}, {});

		return (parsedArgs as queryState);
	}

	public async get(args: queryState) {
		args = this.parseQueryState(args);

		const collection = args.collection;
		const where = args.where;
		const quantity = args.quantity;
		const page = args.page;
		const order = args.order;

		let query: any;

		if( collection === null ){
			throw NullException.noValueFor('collection', 'string');
		}

		query = this._db.collection( collection );

		if( quantity === 1 ){
			query = await query.findOne( where );
			console.log(query);
		}
		else {
			query = await query.find( where );

			if( quantity ){

				if( quantity >= 2 ) query = await query.limit( quantity );

				if( page ){
					if( page >= 2 && quantity >= 2 ) query = await query.skip( (page - 1) * quantity );
				}

			}

			if( order ) query = await query.sort( order );

			query = await query.toArray();
		}

		return query;
	}

}

export default MongoDB
