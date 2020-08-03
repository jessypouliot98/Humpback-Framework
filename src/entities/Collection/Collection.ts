import Model from '../../App/Model/Model'

class Collection extends Array<Model> {

	_modelType?: any;

	constructor(...items: Model[]) {
		super(...items);

		if (!items.length) {
			throw new Error('An empty Collection may not be created');
		}

		Object.defineProperty(this, '_modelType', {
			value: items[0].constructor,
			enumerable: false,
		});

		if ( items.some(item => item.constructor !== this._modelType) ) {
			throw new Error('A Collection may only have items from the same type');
		}
	}

	public toArray(): any[] {
		return this.map(item => item.toObject());
	}

	public async delete() {
		this.forEach((item: Model) => {
			item.delete();
		});

		return this;
	}

	public async forceDelete() {
		this.forEach((item: Model) => {
			item.forceDelete();
		});

		return this;
	}

}

export default Collection
