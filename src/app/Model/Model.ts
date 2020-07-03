import Collection from '../../entities/Collection/Collection'
import Query from '../Query/Query'
import { whereArgs } from '../Query/types'

class Model {

	protected query?: Query;

	protected init(): void {
		this.query = new Query(this);
	}

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


	// Query State

	protected setQueryWhere(arg: whereArgs): void {
		this.query?.setWhere(arg);
	}

	// Select

	public all(): this {
		return this;
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
		// TODO

		return this;
	}

	public page(nb: number = 1): this {
		// TODO

		return this;
	}

	// Relation

	public with(relations: any): this {
		if( !Array.isArray(relations) ) relations = [relations];

		relations.forEach((relation: any) => {
			// TODO
		})

		return this;
	}

	// Query

	public async get(): Promise<Collection> {
		return new Collection(this, { hello: 'world', something: 'cool' });
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
