import BaseModel, { column } from './BaseModel'
import Db from '../../Database/Db/Db'
import DumpAndDie from '../../Support/DumpAndDie/DumpAndDie'
import Factory from '../../Support/Factory/Factory'

function classDecorator<T extends { new (...args: any[]): {} }>(
  constructor: T
) {
  return class extends constructor {
    newProperty = "new property";
    hello = "override";
  };
}

@classDecorator
class Model extends BaseModel {

	protected get self(): typeof Model {
		return this.constructor as typeof Model;
	}

	public static query(): Db {
		return new Db(this.collection);
	}

	public delete() {

    }

    public forceDelete() {

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

}

export default Model
