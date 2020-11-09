import Query, { whereArgs, enumCompare, enumOrder } from '../Query/Query'
import Moment from '../../Support/Moment/Moment'

export type whereParams = [string, enumCompare, any]
export type whereIsParams = [string, any]

export type payload = object;

function getWhereArgs(...params: whereParams | whereIsParams): whereArgs {
    const args: whereArgs = {
        column: params[0],
        operator: '=',
        value: null,
    };

    if (params.length === 2) {
        args.value = params[1];
    } else if (params.length === 3) {
        args.operator = params[1];
        args.value = params[2];
    } else {
        throw new Error('Invalid parameters');
    }

    return args;
}

class Db {

    protected _query: Query;

    protected _useTimestamps = false;
    protected _useSoftDeletes = false;

    protected _createdAtKey?: string;
    protected _updatedAtKey?: string;
    protected _deletedAtKey?: string;

    protected _filter: null | ((data: any) => any) = null;

    public constructor(collectionName?: string) {
        this._query = new Query();

        if (collectionName) {
            this._query.setCollection(collectionName);
        }
    }

    public static collection(collectionName: string) {
        return new this(collectionName);
    }

    public collection(collectionName: string) {
        this._query.setCollection(collectionName);

        return this;
    }

    public useTimestamps(state = true, keys = { createdAt: 'createdAt', updatedAt: 'updatedAt' }) {
        this._useTimestamps = state;
        this._createdAtKey = keys.createdAt;
        this._updatedAtKey = keys.updatedAt;

        return this;
    }

    public useSoftDeletes(state = true, keys = { deletedAt: 'deletedAt' }) {
        this._useSoftDeletes = state;
        this._deletedAtKey = keys.deletedAt;

        return this;
    }

    public setFilter(filter: (data: any) => any) {
        this._filter = filter;

        return this;
    }

    // Retrieving

    public select(columns: string|string[]) {
        this._query.setSelect(Array.isArray(columns) ? columns : [columns]);

        return this;
    }

    // public distinct(columns: string|string[]) {
    //     // this.query.setDistinct(columns);
    //
    //     return this;
    // }

    public where(...params: whereParams) {
        const args = getWhereArgs(...params);

        this._query.setWhere(args);

        return this;
    }

    public whereRaw(raw: any) {
        this._query.setWhere({ raw });

        return this;
    }

    public orWhere(...params: whereParams) {
        const args = getWhereArgs(...params);

        this._query.setOrWhere(args);

        return this;
    }

    public orWhereRaw(raw: any) {
        this._query.setOrWhere({ raw });

        return this;
    }

    public offset(offset: number = 5) {
        this._query.setOffset(offset);

        return this;
    }

    public limit(limit: number = 15) {
        this._query.setLimit(limit);

        return this;
    }

    public orderBy(column: string, order: enumOrder = 'ASC') {
        // this.query.setOrderBy(column, order);

        return this;
    }

    public groupBy(column: string) {
        // this.query.setGroupBy(column);

        return this;
    }

    public raw(query: any) {
        // this.query.setRaw(query);

        return this;
    }

    // CRUD

    public async get(): Promise<(any[]|null)> {
        const data = await this._query.get();

        if (typeof this._filter === 'function' && Array.isArray(data)) {
            return data.map(this._filter);
        }

        return data;
    }

    public async first(): Promise<(any|null)> {
        const data = await this._query.first();

        if (typeof this._filter === 'function') {
            return this._filter(data);
        }

        return data;
    }

    public async newest(): Promise<(any|null)> {
        this.orderBy('id', 'ASC');

        return this.first();
    }

    public async oldest(): Promise<(any|null)> {
        this.orderBy('id', 'DESC');

        return this.first();
    }

    public async find(id: string|number): Promise<(any|null)> {
        this.where('id', '=', id);

        return this.first();
    }

    public async count(): Promise<number> {
        return this._query.count();
    }

    public async pluck(column: string): Promise<any|null> {
        const data = await this.select([column]).get();

        if (!data) {
            return null;
        }

        return data.map(value => value[column]);
    }

    public async chunk<T = object>(callback: (items: Array<T>) => (Promise<void>|void), quantity: number = 1000): Promise<void> {
        return new Promise<void>( async(resolve, _reject) => {
            const count = await this.count();

            for (let i = 0; i < count; i += quantity) {
                const items: any = await this.limit(quantity).offset(i / quantity * quantity).get();

                await callback(items);
            }

            resolve();
        });
    }

    public async each<T = object>(callback: (item: T) => (Promise<void>|void), quantity: number = 1000): Promise<void> {
        return new Promise<void>(async(resolve, _reject) => {
            this.chunk(async(items: Array<T>) => {
                for (const item of items) {
                    await callback(item);
                }
            }, quantity);

            resolve();
        });
    }

    public async exists(): Promise<boolean> {
        return this._query.exists();
    }

    public async store(payload: payload): Promise<any> {
        return this._query.store(payload);
    }

    public async update(payload: payload): Promise<any> {
        if (this._useTimestamps && this._updatedAtKey) {
            payload = {
                [this._updatedAtKey]: Moment.now().toISO(),
                ...payload,
            };
        }

        return this._query.update(payload);
    }

    // public async increment(column: string, increment: number = 1): Promise<number> {
    //     // this.query.increment(column, increment);
    //
    //     return 1;
    // }
    //
    // public async decrement(column: string, decrement: number = 1): Promise<number> {
    //     return this.increment(column, -decrement);
    // }

    public async delete(): Promise<any | boolean> {
        if (this._useSoftDeletes && this._deletedAtKey) {
            const payload = { [this._deletedAtKey]: Moment.now().toISO() };

            return this._query.update(payload);
        }

        return this._query.delete();
    }

    public async forceDelete(): Promise<boolean> {
        return this._query.delete();
    }

    public async getSchema(): Promise<any> {
        return this._query.getSchema();
    }

    public async createSchema(schema): Promise<boolean> {
        return this._query.createSchema(schema);
    }

    public async updateSchema(schema): Promise<boolean> {
        return this._query.updateSchema(schema);
    }

    public async deleteSchema(): Promise<boolean> {
        return this._query.deleteSchema();
    }

}

export default Db
