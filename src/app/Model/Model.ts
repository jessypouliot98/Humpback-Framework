import BaseModel from './BaseModel'
import Collection from '../../Entities/Collection/Collection'
import Db from './Db/Db'
import { payload, enumCompare } from '../Query/Query'

class Model extends BaseModel {

	protected _db: Db|null = null;
	protected _entries: any = null;

	constructor(values?: object){
		super();

		Object.defineProperty(this, '_db', { enumerable: false, value: this._db });
		Object.defineProperty(this, '_entries', { enumerable: false, value: this._entries });
		Object.defineProperty(this, 'generateModel', { enumerable: false, value: this.generateModel });
		Object.defineProperty(this, 'parsePayload', { enumerable: false, value: this.parsePayload });

		if (!values) {
			return;
		}

		this._entries = Object.keys(values).reduce<any>((acc: any, key: string) => {
			const value = values[key];

			if (key === '_id') {
				key = 'id';
			}

			acc[key] = this[key] = value;

			return acc;
		}, {});

		this.db.where(['id', '=', this._entries.id])
	}

	protected get db(): Db {
		if (!this._db) {
			this._db = Db.collection((this.constructor as any).collection);
		}

		return this._db;
	}

	// Helpers

	public toObject() {
		return { ...this as any };
	}

	protected generateModel = (data: any): Model => {
		const self: any = this.constructor;
		return new self(data);
	}

	protected parsePayload = (payload: any): any => {
		const self: any = this.constructor;
		const fields = self.columns

		return Object.keys(payload).reduce((acc, key) => {
			if ( !fields[key] ) {
				return acc;
			}

			acc[key] = payload[key];

			return acc;
		}, {});
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

	public where(a: string, b: string|number|enumCompare, c?: string|number): this {
		let field: string,
			condition: enumCompare,
			value: string | number;

		if ( c ) {
			field = a;
			condition = (b as enumCompare);
			value = c;
		} else {
			field = a;
			condition = '=';
			value = b;
		}

		this.db.where([field, condition, value]);

		return this;
	}

	public static where(a: string, b: string|number|enumCompare, c?: string|number) {
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
		return this.generateModel(data);
	}

	public async get(): Promise<Collection|null> {
		const data = await this.db.get();
		return new Collection( ...data.map(this.generateModel) );
	}

	public async create(payload: payload): Promise<Model> {
		return await this.db.create( this.parsePayload(payload) );
	}

	public static async create(payload: payload): Promise<Model> {
		return new this().create(payload);
	}

	public async update(payload: payload): Promise<any> {
		return await this.db.update( this.parsePayload(payload) );
	}

	public async delete(): Promise<any> {
		return await this.db.update({ deletedAt: '0' });
	}

	public async forceDelete(): Promise<any> {
		return await this.db.delete();
	}

	public async all(): Promise<Collection|null|any> {
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
