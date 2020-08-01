import Model from '../../App/Model/Model'

class Collection extends Array {

	_modelType?: any;

	constructor(...items: Model[]) {
		if (!items.length) {
			throw new Error('An empty Collection may not be created');
		}

		const modelType: any = items[0].constructor;

		if ( items.some(item => item.constructor !== this._modelType) ) {
			throw new Error('A Collection may only have items from the same type');
		}

		super(...items as any);
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
