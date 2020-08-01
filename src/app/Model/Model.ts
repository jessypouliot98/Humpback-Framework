import BaseModel from './BaseModel'
import Collection from '../../Entities/Collection/Collection'
import Db, { DBState } from './Db/Db'
import DatabaseException from '../../Exception/DatabaseException/DatabaseException'

class Model extends BaseModel {

	protected _db: Db|null = null;
	protected _entries: any = null;

	constructor(values?: object){
		super();

		if (!values) {
			return;
		}

		this._entries = Object.keys(values).reduce<any>((key: string, acc: any) => {
			if (key === '_id') {
				key = 'id';
			}

			this[key] = values[key];
			acc[key] = values[key];

			return acc;
		}, {});
	}

	protected get db(): Db {
		if (!this._db) {
			this._db = Db.collection((this.constructor as any).collection);
		}

		return this._db;
	}

	// Helpers

	protected generateModel(data: any): Model {
		return new (this.constructor as any)(data);
	}

	// Relations

	public hasOne(model: BaseModel, localField: string, otherField: string) {
		return async() => {
			return (model as Model).where(otherField, '=', this[localField]).first();
		}
	}

	public hasMany(model: BaseModel, localField: string, otherField: string) {
		return async() => {
			return (model as Model).where(otherField, '=', this[localField]).get();
		}
	}

	public belongsTo(model: BaseModel, localField: string, otherField: string) {
		return async() => {
			return (model as Model).where(otherField, '=', this[localField]).first();
		}
	}

	public belongsToMany(model: BaseModel, localField: string, otherField: string) {
		return async() => {
			return (model as Model).where(otherField, '=', this[localField]).get();
		}
	}

	// Select

	public where(a: string, b: string|number, c?: string|number): this {
		let field: string,
			condition: string,
			value: string | number;

		if( c ){ field = a; condition = (b as string); value = c; }
		else { field = a; condition = '='; value = b; }

		return this;
	}

	public static where(a: string, b: string|number, c?: string|number) {
		return new this().where(a, b, c);
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

		return this;
	}

	public page(nb: number = 1): this {

		return this;
	}

	// Relation

	public with(relation: string|string[]): this {
		const relations = !Array.isArray(relation) ? [relation] : relation

		relations.forEach((relation) => {

		});

		return this;
	}

	// Query

	public async first(): Promise<Model|null> {
		const data = await this.db.first();
		return new (this.constructor as any)(data);
	}

	public async get(): Promise<Collection|null> {
		const data = await this.db.get();
		return new Collection( ...data.map(this.generateModel) );
	}

	public async create(payload: DBState['payload']): Promise<any> {
		return await this.db.create(payload);
	}

	public async update(payload: DBState['payload']): Promise<any> {
		return await this.db.update(payload);
	}

	public async delete(): Promise<any> {
		return await this.db.update({ deletedAt: '0' });
	}

	public async forceDelete(): Promise<any> {
		return await this.db.delete();
	}

	public async all(): Promise<Collection|null> {
		const data = await this.db.get();
		return new Collection( ...data.map(this.generateModel) );
	}

	public static async all(): Promise<Collection|null> {
		return await new this().all();
	}

	public async find(id: string|number): Promise<Model|null> {
		return await this.where('id', '=', id).first();
	}

	public static async find(id: string|number): Promise<Model|null> {
		return await new this().find(id);
	}

}

export default Model
