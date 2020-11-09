import Driver from '../Driver'
import { queryState, whereArgs, whereRaw, enumOrder } from '../../Query/Query'
import { MongoClient, ObjectID, Db, FilterQuery, InsertOneWriteOpResult } from 'mongodb'
import { getValidator } from './helpers'

export type mongoState = {
	collection: string,
	select?: string|string[],
	where: FilterQuery<any>,
	order?: [string, enumOrder],
	limit?: number,
	offset?: number,
};

function formatWhere(whereCondition: whereArgs | whereRaw): object {
	if (typeof (whereCondition as whereRaw).raw === 'object') {
		return (whereCondition as whereRaw).raw as object;
	}

	const where = whereCondition as whereArgs;

	if (['id', '_id'].includes(where.column)) {
		const getObjectID = (id: any) => id instanceof ObjectID ? id : new ObjectID(id);

		where.column = '_id';

		where.value = Array.isArray(where.value) ?
			where.value.map(getObjectID) :
				getObjectID(where.value)
	}

	switch(where.operator){
		case '=':
			return { [where.column]: where.value };

		case '!=':
			return { [where.column]: { $ne: where.value, $exists: true } };

		case 'in':
			return { [where.column]: { $in: where.value, $exists: true } };

		case 'notIn':
			return { [where.column]: { $nin: where.value, $exists: true } };

		case 'contains':
			return { [where.column]: { $regex: `.*${where.value}.*`, $exists: true } };

		case 'notContains':
			return { [where.column]: { $not: { $regex: `.*${where.value}.*` }, $exists: true } };

		case 'regex':
			return { [where.column]: { $regex: where.value, $exists: true } };

		case '>=':
			return { [where.column]: { $gte: where.value, $exists: true } };

		case '>':
			return { [where.column]: { $gt: where.value, $exists: true } };

		case '<=':
			return { [where.column]: { $lte: where.value, $exists: true } };

		case '<':
			return { [where.column]: { $lt: where.value, $exists: true } };

		default:
			throw new Error(`${where.operator} is not a valid operator`)
	}
};

function andWheres(where, args) {
	where.$and = [...where.$and, formatWhere(args)];

	return where;
}

function orWheres(where, args) {
	const orGroup = args.reduce(andWheres, { $and: [] });

	where.$or = [...where.$or, orGroup];

	return where;
}

class MongoDB extends Driver {

	protected _client?: MongoClient;
	protected _db?: Db;

	public constructor() {
		super();
	}

    protected parseWhereArgs(whereArgs: queryState['where']): mongoState['where'] {
		if (!whereArgs) {
			return {};
		}

		return whereArgs.reduce(orWheres, { $or: [] });
    }

	protected parseOp(op: any): object {
		return Object.entries(op).reduce<any>((data, [key, value]) => {
			switch (key) {
				case '_id':
					data['id'] = value;
					break;

				default:
					data[key] = value;
					break;
			}

			return data;
		}, {});
	}

	protected parseResponseObjectID(value: any) {
		const data = { ...value };

		if (data._id) {
			data.id = data._id;
			delete data._id;
		}

		return data;
	};

	protected get client(): MongoClient {
		if (!this._client) {
			throw new Error('No client');
		}

		return this._client;
	}

	protected get db(): Db {
		if (!this._db) {
			throw new Error('No Db');
		}

		return this._db;
	}

    protected get state(): mongoState {
        const defaultState: mongoState = { collection: '', select: undefined, where: {}, order: undefined, limit: undefined, offset: undefined };

        if (!this._state) {
            throw new Error('No Collection');
        }

        const qState = this._state;

		const parsedArgs: any = Object.keys({...this._state}).reduce((acc, key) => {
			let prop = qState[key];

			if ( prop === null ) {
				return acc;
			}

			switch(key){

				case 'where':
					acc.where = this.parseWhereArgs(prop as queryState['where']);
					break;

				default:
					acc[key] = prop;
					break;

			}

			return acc;
		}, defaultState);

		return (parsedArgs as mongoState);
	}

    public async connect({ DB_HOST, DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD }) {
		try{
			const auth = (DB_USERNAME && DB_PASSWORD) ? `${DB_USERNAME}:${DB_PASSWORD}@` : '';

			let url = `mongodb://${auth}${DB_HOST}:${DB_PORT}`;

            if (DB_NAME) {
                url = `${url}/${DB_NAME}`;
            }

			// if (true) { // @TODO Remove and find a better fix
			// 	url += '?authSource=admin';
			// }

			const args = { useNewUrlParser: true, useUnifiedTopology: true };

			this._client = await MongoClient.connect(url, args);
			this._db = this._client.db(DB_NAME);

			return this;
		}
		catch(err) {
			throw err;
		}
	}

    public async first(): Promise<any> {
		const { collection, where } = this.state;

		const value = await this.db.collection(collection).findOne(where);

		return this.parseResponseObjectID(value);
	}

    public async get(): Promise<any> {
		const { collection, where, limit, offset } = this.state;

		let query = this.db.collection(collection).find(where);

		if (limit) {
			query = query.limit(limit);
		}

		if (offset) {
			query = query.skip(offset);
		}

		const values = await query.toArray();

		return values.map(this.parseResponseObjectID);
    }

    public async count() {
		const { collection, where, limit, offset } = this.state;

		let query = this.db.collection(collection).find(where);

		if (limit) {
			query = query.limit(limit);
		}

		if (offset) {
			query = query.skip(offset);
		}

		return query.count();
    }

    public async store(payload: any) {
		const { collection } = this.state;

		let query = this.db.collection(collection);

		const resp = await query.insertOne(payload);

		const [op] = resp.ops;

		return this.parseOp(op)
    }

    public async update(payload: any) {
		const { collection, where } = this.state;

		let query = this.db.collection(collection);

		return query.updateMany({ userName: 'jessyp98' }, { bob: 'bob' });
    }

    public async delete() {
		const { collection, where } = this.state;

		let query = this.db.collection(collection);

		return query.deleteMany(where);
    }

	public async getSchema() {
		const { collection } = this.state;

		const infos = await this.db.admin().command({
			validate: collection,
			full: true,
		});

		return infos;
	}

	public async createSchema(schema: any) {
		const { collection } = this.state;

		try {
			await this.db.createCollection(collection, {
				validator: getValidator(schema),
				validationLevel: 'strict',
				validationAction: 'error',
			});

			return true;
		} catch(_error) {
			return false;
		}
	}

	public async updateSchema(schema: any) {
		const { collection } = this.state;

		try {
			await this.db.command({
				collMod: collection,
				validator: { $jsonSchema: getValidator(schema) },
				validationLevel: 'strict',
				validationAction: 'error',
			});

			return true;
		} catch(_error) {
			return false;
		}
	}

	public async deleteSchema() {
		const { collection } = this.state;

		return await this.db.dropCollection(collection);
	}

}

export default MongoDB
