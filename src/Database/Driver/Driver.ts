import { queryState } from '../Query/Query'

export type connectionArgs = {
	DB_HOST: string,
	DB_PORT: string,
	DB_NAME?: string,
	DB_USERNAME?: string,
	DB_PASSWORD?: string,
}

abstract class Driver {

    protected _state?: queryState;
	protected _client?: any;
    protected _db?: any;

    public setState(state: queryState): this {
        this._state = state;

        return this;
    }

    abstract async connect(args: connectionArgs): Promise<this>

    abstract async first(): Promise<any>

    abstract async get(): Promise<any[]>

    abstract async count(): Promise<number>

    abstract async store(): Promise<any>

    abstract async update(): Promise<any>

    abstract async delete(): Promise<any>

	abstract async getSchema(): Promise<any>

	abstract async createSchema(schema): Promise<boolean>

	abstract async updateSchema(schema): Promise<boolean>

	abstract async deleteSchema(): Promise<boolean>

}

export default Driver
