import Query, { whereArgs, enumCompare, enumOrder } from '../Query/Query'

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

    public orWhere(...params: whereParams) {
        const args = getWhereArgs(...params);

        this._query.setOrWhere(args);

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

        return data;
    }

    public async first(): Promise<(any|null)> {
        const data = await this._query.first();

        return data;
    }

    public async newest(): Promise<(any|null)> {
        this.orderBy('id', 'ASC');

        // const data = await this.query.first();

        return {};
    }

    public async oldest(): Promise<(any|null)> {
        this.orderBy('id', 'DESC');

        // const data = await this.query.first();

        return {};
    }

    public async find(id: string|number): Promise<(any|null)> {
        this.where('id', '=', id);

        const data = await this._query.first() as any;

        return data;
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

    public async exists() {
        return this._query.exists();
    }

    public async insert(payload: payload): Promise<boolean> {
        // this.query.insert(payload);

        return true;
    }

    public async update(payload: payload): Promise<boolean> {
        // this.query.update(payload);

        return true;
    }

    public async increment(column: string, increment: number = 1): Promise<number> {
        // this.query.increment(column, increment);

        return 1;
    }

    public async decrement(column: string, decrement: number = 1): Promise<number> {
        return this.increment(column, -decrement);
    }

    public async delete(): Promise<boolean> {
        // this.query.delete();

        return true;
    }

    public async forceDelete(): Promise<boolean> {
        // this.query.forceDelete();

        return true;
    }

}

export default Db
