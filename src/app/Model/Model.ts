import BaseDatabaseType from '../../Database/Types/Base'
import * as DatabaseType from '../../Database/Types/Types'
import DumpAndDie from '../../Support/DumpAndDie/DumpAndDie'
import Factory from '../../Support/Factory/Factory'
import Db from '../../Database/Db/Db'
import Validator from '../../Support/Validator/Validator'
import Moment from '../../Support/Moment/Moment'

export type column = {
	name: string,
	type: BaseDatabaseType,
	defaultValue?: any,
	nullable?: boolean,
	filter? (value: any): any
}

export type col = {
	type: column['type'],
	defaultValue?: column['defaultValue'],
	nullable?: column['nullable'],
	filter?: column['filter'],
}

export const defineColumn = (parameters: col) => (target: Model, key: string) => {
	const self = target.constructor as typeof Model;

	let _value = target[key] || parameters.defaultValue || null;

	self.columns.push({ name: key, ...parameters });

	if (typeof parameters.filter === 'function') {
		target[key] = parameters.filter(_value);
	} else {
		target[key] = _value;
	}
}

class Model {

	public static columns: column[] = [];

	public constructor(parameters = {}) {
		Object.entries(parameters).forEach(([key, value]) => {
			this[key] = value;
		});

		if (this.self.useTimestamps) {
			const now = Moment.now().toISO();
			this[this.self.createdAtKey] = now;
			this[this.self.updatedAtKey] = now;
		}

		if (this.self.useSoftDeletes) {
			this[this.self.deletedAtKey] = null;
		}
	}

	public static collection: string;

	public static useTimestamps: boolean = true;
	public static useSoftDeletes: boolean = true;

	public static uniqueKey: string = 'id';
	public static createdAtKey: string = 'createdAt';
	public static updatedAtKey: string = 'updatedAt';
	public static deletedAtKey: string = 'deletedAt';

	public getKey() {
		return this.self.uniqueKey;
	}

	public static getColumns(): column[] {
		const columns = [...this.columns];

		if (this.useTimestamps) {
			const now = Moment.now().toISO();

			columns.push({
				name: this.createdAtKey,
				type: DatabaseType.Timestamp,
				defaultValue: now,
			});

			columns.push({
				name: this.updatedAtKey,
				type: DatabaseType.Timestamp,
				defaultValue: now,
			});
		}

		if (this.useSoftDeletes) {
			columns.push({
				name: this.deletedAtKey,
				type: DatabaseType.Timestamp,
				nullable: true,
			});
		}

		return columns;
	}

	public static getColumn(name: string) {
		return this.getColumns().find(column => column.name === name);
	}

	public setAttributes(payload: object): void {
		Object.entries(payload).forEach(([key, value]) => {
			this[key] = value;
		});
	}

	public getAttributes(withConditionals: boolean = true) {
		const columns = withConditionals ? this.self.getColumns() : this.self.columns;

		return columns.reduce<any>((attributes, column) => {
			attributes[column.name] = this[column.name];

			return attributes;
		}, {});
	}

	protected get self(): typeof Model {
		return this.constructor as typeof Model;
	}

	// Helpers

	public toObject() {
		return { ...this as any };
	}

	public static factory(count: number = 1) {
		return new Factory((this as any), count);
	}

	public __dump() {
		const staticProperties = Object.getOwnPropertyNames(this).reduce((acc, property) => {
			if (['length', 'prototype', 'name'].includes(property)) {
				return acc;
			}

			switch (property) {
				case 'columns':
					acc[property] = this.self.getColumns().map((column: column) => column.name);
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
				useTimestamps: this.self.useTimestamps,
				useSoftDeletes: this.self.useSoftDeletes,
				...staticProperties,
			}
		};
	}

	public dd() {
		DumpAndDie.call(this);
	}

	public static validate(payload: any) {
		return Validator.make(payload, []);
	}

    // Model query

    public static query(): Db {
		const db = Db.collection(this.collection);

		if (this.useTimestamps) {
			db.useTimestamps();
		}

		if (this.useSoftDeletes) {
			db.useSoftDeletes();
		}

        return db.setFilter((data: any) => new this(data));;
    }

	public query() {
		return this.self.query();
	}

	protected getQueryPayload(attributes: object) {
		return Object.entries(attributes).reduce<any>((payload, [key, value]) => {
			const column = this.self.getColumn(key);

			if (!column) {
				return payload;
			}

			payload[key] = typeof column.filter === 'function' ?
				column.filter(value) : value;

			return payload;
		}, {});
	}

	public static async create<T extends Model>(payload?: any): Promise<T> {
		return new this().create(payload) as unknown as T;
	}

	public async create(payload: any) {
		const data = await this.query().store(this.getQueryPayload(payload));

		this.setAttributes(data);

		return this;
	}

	public async update(payload: any) {
		const key = this.getKey();

		const data = await this.query()
			.where(key, '=', this[key])
			.update(this.getQueryPayload(payload));

		this.setAttributes(data);

		return this;
	}

	public async delete(): Promise<any> {
		const key = this.getKey();

		return this.query().where(key, '=', this[key]).delete();
    }

	public async forceDelete(): Promise<any> {
		const key = this.getKey();
		
		return this.query().where(key, '=', this[key]).forceDelete();
    }

}

export default Model
