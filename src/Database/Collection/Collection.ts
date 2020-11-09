import Model from '../../App/Model/Model'
import DumpAndDie from '../../Support/DumpAndDie/DumpAndDie'

class Collection<T extends Model> extends Array<T> {

	_modelType: typeof Model;

	constructor(...items: T[]) {
		super(...items);

		this._modelType = items[0].constructor as typeof Model;

		Object.defineProperty(this, '_modelType', { value: this._modelType, enumerable: false });

		if ( items.some(item => (item.constructor as typeof Model) !== this._modelType) ) {
			throw new Error('A Collection may only have items from the same type');
		}
	}

	public toArray(): any[] {
		return this.map(item => item.toObject());
	}

	public first() {
		return this[0];
	}

	public offset(offset: number = 5) {
		this.splice(0, offset);
		return this;
	}

	public limit(limit: number = 15) {
		this.splice(limit);
		return this;
	}

	public async delete() {
		const itemIds = this.map(item => item.getKey());

		this._modelType.query().where('id', 'in', itemIds).delete();

		return this;
	}

	public async forceDelete() {
		const itemIds = this.map(item => item.getKey());

		this._modelType.query().where('id', 'in', itemIds).forceDelete();

		return this;
	}

	public __dump() {
		return {
			collection: this.map(value => {
				if (typeof value.__dump === 'function') {
					return value.__dump();
				}

				return value;
			}),
		};
	}

	public dd() {
		DumpAndDie.call(this);
	}

}

export default Collection
