import BaseModel, { column } from './BaseModel'
import Collection from '../../Entities/Collection/Collection'
import Db from './Db/Db'
import { payload, enumCompare } from '../Query/Query'
import DumpAndDie from '../../utilities/DumpAndDie/DumpAndDie'
import Factory from '../Factory/Factory'

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

	protected get self(): any {
		return this.constructor as any;
	}

	protected get db(): Db {
		if (!this._db) {
			this._db = Db.collection(this.self.collection);

			this._db.useSoftDeletes = this.self.useSoftDeletes;
		}

		return this._db;
	}

	// Helpers

	public toObject() {
		return { ...this as any };
	}

	public static factory(count: number = 1) {
		return new Factory((this as any), count);
	}

	public dump() {
		const staticProperties = Object.getOwnPropertyNames(this.self).reduce((acc, property) => {
			if (['length', 'prototype', 'name'].includes(property)) {
				return acc;
			}

			switch (property) {
				case 'columns':
					acc[property] = this.self.allColumns.map((column: column) => column.name);
					break;

				default:
					acc[property] = this.self[property];
					break;
			}

			return acc;
		}, {});

		return {
			model: {
				model: this.self.name,
				...staticProperties,
				useTimestamps: this.self.useTimestamps,
				useSoftDeletes: this.self.useSoftDeletes,
				originals: this.toObject(),
			}
		};
	}

	public dd() {
		DumpAndDie.call(this);
	}

	protected generateModel = (data: any): this => {
		return new this.self(data);
	}

	protected parsePayload = (payload: any): any => {
		const fields = this.self.allColumns;

		return Object.keys(payload).reduce((acc, key) => {
			if ( !fields.some(field => field.name === key) ) {
				return acc;
			}

			if (typeof payload[key] === 'function') {
				acc[key] = payload[key]();
			} else {
				acc[key] = payload[key];
			}


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

	public where(a: string, b: enumCompare|any, c?: any|any[]): this {
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

	public static where(a: string, b: enumCompare|any, c?: any|any[]) {
		return new this().where(a, b, c);
	}

	// Trash

	public withoutTrash(): this {
		this.db.getTrashed = 'without';
		return this;
	}

	public static withoutTrash() {
		return new this().withoutTrash();
	}

	public withTrash(): this {
		this.db.getTrashed = 'with';
		return this;
	}

	public static withTrash() {
		return new this().withTrash();
	}

	public onlyTrash(): this {
		this.db.getTrashed = 'only';
		return this;
	}

	public static onlyTrash() {
		return new this().onlyTrash();
	}

	// Quantity

	public limit(limit: number = 10): this {
		this.db.limit(limit);;
		return this;
	}

	public static limit(limit: number = 10) {
		return new this().limit(limit);
	}

	public offset(offset: number = 10): this {
		this.db.offset(offset);;
		return this;
	}

	public static offset(offset: number = 10) {
		return new this().offset(offset);
	}

	// Relation

	public with(relation: string|string[]): this {
		const relations = !Array.isArray(relation) ? [relation] : relation

		relations.forEach((relation) => {

		});

		return this;
	}

	// Query

	public async first(): Promise<this|null> {
		const data = await this.db.first();

		if (!data) {
			return null;
		}

		return this.generateModel(data);
	}

	public async get(): Promise<Collection|null> {
		const data = await this.db.get();

		if (!data.length) {
			return null;
		}

		return new Collection( ...data.map(this.generateModel) );
	}

	public async create(payload: payload): Promise<this> {
		const now = this.self.useTimestamps ? Date.now() : undefined;
		const deletedAt = this.self.useSoftDeletes ? null : undefined;

		return await this.db.create( this.parsePayload({
			...payload,
			createdAt: now,
			updatedAt: now,
			deletedAt,
		}) );
	}

	public static async create(payload: payload) {
		return new this().create(payload);
	}

	public async update(payload: payload): Promise<this> {
		const now = this.self.useTimestamps ? Date.now() : undefined;

		return await this.db.update( this.parsePayload({
			...payload,
			updatedAt: now,
		}) );
	}

	public async delete(): Promise<any> {
		const now = this.self.useTimestamps ? Date.now() : undefined;

		return await this.db.update({ deletedAt: now });
	}

	public async restore(): Promise<any> {
		return await this.db.update({ deletedAt: null });
	}

	public async forceDelete(): Promise<any> {
		return await this.db.delete();
	}

	public async all(): Promise<Collection|null> {
		return this.get();
	}

	public static async all(): Promise<Collection|null> {
		return await new this().all();
	}

	public async find(id: string|number): Promise<this|null> {
		return await this.where('id', '=', id).first();
	}

	public static async find(id: string|number) {
		return await new this().find(id);
	}

}

export default Model
