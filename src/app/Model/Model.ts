import BaseModel, { column } from './BaseModel'
import DumpAndDie from '../../Support/DumpAndDie/DumpAndDie'
import Factory from '../../Support/Factory/Factory'
import Db from '../../Database/Db/Db'

class Model extends BaseModel {

	public constructor(data?: object) {
		super();
		console.log(data);
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

    // Model query

    public static query(): Db {
		// .setDataMapper((data: any) => new this(data));
        return Db.collection(this.collection);
    }

    public async delete(): Promise<boolean> {
        return await Db.collection(this.self.collection)
            .where('id', '=', 'this.id')
            .delete();
    }

}

export default Model
