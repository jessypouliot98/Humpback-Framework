import Driver from '../Driver/Driver'
import MongoDB from '../Driver/MongoDB/MongoDB'
import Config from '../../Support/Config/Config'

export type enumCompare = '=' | '!=' | '>' | '<' | '>=' | '<=' | 'in' | 'notIn' | 'contains' | 'notContains' | 'regex' | 'raw';
export type enumOrder =  'ASC' | 'DESC';

export type whereArgs = {
    column: string,
    operator: enumCompare,
    value: any,
}

export type whereRaw = {
    raw: any
}

export type queryState = {
	collection: string|null,
	select: string[]|null,
	where: Array<Array<whereArgs|whereRaw>>|null,
	order: [string, enumOrder]|null,
	limit: number|null,
	offset: number,
};

export type payload = object;

class Query {

    protected _dataMapper?: unknown;

	protected _state: queryState = {
		collection: null,
		select: null,
		where: null,
		order: null,
		limit: 0,
		offset: 0,
	}

    protected async loadDriver(): Promise<Driver> {
        let driver: Driver;

        switch (Config.db.DB_DRIVER) {
            case 'mongodb':
            default:
                driver = await new MongoDB().connect(Config.db);
        }

        return driver.setState(this._state);
    }

    public setDataMapper<T = unknown>(dataMapper: (data: any) => T) {
        this._dataMapper = dataMapper;
    }

	public setCollection(collectionName: string) {
		this._state.collection = collectionName;
	}

	public setSelect(columns: string[]) {
		this._state.select = columns;
	}

	public setWhere(where: whereArgs | whereRaw) {
		if (this._state.where === null) {
			this._state.where = [
				[
					where,
				]
			];
			return;
		}

		const [...queryWhere] = this._state.where;

		const currentWhere = queryWhere.pop() as whereArgs[];

		this._state.where = [
			...queryWhere,
			[
				...currentWhere,
				where,
			]
		];
	}

	public setOrWhere(where: whereArgs | whereRaw) {
		if (this._state.where === null) {
			this._state.where = [
				[
					where,
				]
			];
			return;
		}

		const [...queryWhere] = this._state.where;

		this._state.where = [
			...queryWhere,
			[
				where,
			]
		];
	}

    public setOffset(offset: number = 15) {
        this._state.offset = offset;
    }

    public setLimit(limit: number = 15) {
        this._state.limit = limit;
    }

    public async first() {
        const driver = await this.loadDriver();

        return driver.first();
    }

    public async get() {
        const driver = await this.loadDriver();

        return driver.get();
    }

    public async count() {
        const driver = await this.loadDriver();

        return driver.count();
    }

    public async exists() {
        const driver = await this.loadDriver();
        const count = await driver.count();

        return count > 0;
    }

    public async store(payload: any) {
        const driver = await this.loadDriver();

        return driver.store(payload);
    }

    public async update(payload: any) {
        const driver = await this.loadDriver();

        return driver.update(payload);
    }

    public async delete() {
        const driver = await this.loadDriver();

        return driver.delete();
    }

    public async getSchema() {
        const driver = await this.loadDriver();

        return driver.getSchema();
    }

    public async createSchema(schema) {
        const driver = await this.loadDriver();

        return driver.createSchema(schema)
    }

    public async updateSchema(schema) {
        const driver = await this.loadDriver();

        return driver.updateSchema(schema)
    }

    public async deleteSchema() {
        const driver = await this.loadDriver();

        return driver.deleteSchema()
    }

}

export default Query;
