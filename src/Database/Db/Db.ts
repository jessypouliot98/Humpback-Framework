import { enumCompare, enumOrder } from '../Query/Query'

export type QueryState = {
    collection: string,
    where: any[]|null,
}

export type whereParams = [string, enumCompare, any] | [string, any]
export type whereArgs = {
    column: string,
    operator: enumCompare,
    value?: any,
}

export type payload = object;

function getWhereArgs(...params: whereParams) {
    const args: whereArgs = {
        column: params[0],
        operator: '=',
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

    protected _collection?: string;

    public constructor(collectionName: string) {
        this._collection = collectionName;
    }

    public static collection(collectionName: string) {
        return new this(collectionName);
    }

    // Retrieving

    public select(columns: string|string[]) {
        // this.query.setSelect(columns);

        return this;
    }

    public distinct(columns: string|string[]) {
        // this.query.setDistinct(columns);

        return this;
    }

    public where(...params: whereParams) {
        const args = getWhereArgs(...params);

        // this.query.setWhere(args);

        return this;
    }

    public orWhere(...params: whereParams) {
        const args = getWhereArgs(...params);

        // this.query.setOrWhere(args);

        return this;
    }

    public offset(offset: number = 5) {
        // this.query.setOffset(offset);

        return this;
    }

    public limit(limit: number = 15) {
        // this.query.setLimit(limit);

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
        // const data = await this.query.get();

        return [];
    }

    public async first(): Promise<(any|null)> {
        // const data = await this.query.first();

        return {};
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
        // this.where('id', '=', id);

        // const data = await this.query.first();

        return {};
    }

    public async count(): Promise<number> {
        // const data = await this.query.count();

        return 0;
    }

    public async pluck(column: string): Promise<any|null> {
        // const data = await this.query.pluck(column);

        return [];
    }

    public async chunk(quantity: number = 1000, callback: () => (Promise<void>|void)): Promise<void> {
        // TODO
    }

    public async exists() {
        const count = await this.count();

        return count === 0;
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
