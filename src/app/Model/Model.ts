import Collection from '../../entities/Collection/Collection'
import Query from '../Query/Query'
import DatabaseException from '../../exception/DatabaseException/DatabaseException'
import { whereArgs } from '../Query/types'

class Model {

	protected _query: Query|null = null;

	// Config

	public static collection: string;

	public static columns: object;

	public static useTimestamps = true;

	public static useSoftDeletes = true;

	public static get allColumns() {
		const timestampColumns = this.useTimestamps ? {
			created_at: String,
			updated_at: String,
		} : undefined;

		const deleteColumns = this.useSoftDeletes ? {
			deleted_at: String,
		} : undefined;

		return {
			...this.columns,
			...timestampColumns,
			...deleteColumns
		}
	}

	public static guarded: string[] = [];

	public static hidden: string[] = [];

	public static cascadeDeletes: string[] = [];

	public static dispatchesEvents = {};

	// Initialiser

	constructor(){
		Object.defineProperty(this, '_query', {
			enumerable: false,
			value: new Query(this),
		})
	}

	// Get

	protected get query(): Query {
		if(this._query === null)
			throw DatabaseException.notInitialized();

		return (this._query as Query);
	}

	// Query State

	protected setQueryWhere(arg: whereArgs): void {
		this.query?.setWhere(arg);
	}

	protected setQueryQuantity(qty: number): void {
		this.query?.setQuantity(qty);
	}

	protected setQueryWith(relation: string): void {
		this.query?.setWith(relation);
	}

	// Relations

	public hasOne(model: any, localField: string, otherField: string) {
		return async() => {
			return 'TODO';
		}
	}

	// Select

	public all(): this {
		return this;
	}

	public static all() {
		return new this().all();
	}

	public where(a: string, b: string|number, c?: string|number): this {
		let field: string,
			condition: string,
			value: string | number;

		if( c ){ field = a; condition = (b as string); value = c; }
		else { field = a; condition = '='; value = b; }

		this.setQueryWhere({ field, condition, value });

		return this;
	}

	public static where(a: string, b: string|number, c?: string|number) {
		return new this().where(a, b, c);
	}

	public async find(id: string|number): Promise<Collection> {
		return this.where('_id', '=', id).first();
	}

	public static async find(id: string|number): Promise<Collection> {
		return new this().find(id);
	}

	// Order

	public orderBy(field: string, order: string = 'ASC'): this {
		// TODO

		return this;
	}

	public latest(): this {
		// TODO

		return this;
	}

	// Quantity

	public limit(qty: number = 5): this {
		this.setQueryQuantity(qty);

		return this;
	}

	public page(nb: number = 1): this {
		// TODO

		return this;
	}

	// Relation

	public with(relation: string|string[]): this {
		const relations = !Array.isArray(relation) ? [relation] : relation

		relations.forEach((relation) => {
			this.setQueryWith(relation);
		});

		return this;
	}

	// Query

	public async first(): Promise<Collection> {
		return this.query.first();
	}

	public async get(): Promise<Collection[]> {
		return this.query.get();
	}

	public async create(): Promise<Collection> {
		return new Collection(this, { hello: 'world' });
	}

	public async update(): Promise<Collection> {
		return new Collection(this, { hello: 'world' });
	}

	public async replace(): Promise<Collection> {
		return new Collection(this, { hello: 'world' });
	}

	public async delete(): Promise<Collection> {
		return new Collection(this, { hello: 'world' });
	}

}

export default Model
