import Model from '../../app/Model/Model'

class Collection {

	public model: Model;
	public entries: any;

	protected _id?: string|number;

	constructor(model: Model, data?: any){
		this.model = model;
		this.entries = data;

		Object.defineProperty(this, '_id', { enumerable: false, value: data?._id });
	}

	public get id(): string|number {
		if( this._id == undefined ) {
			throw new Error('TODO')
		}

		return this._id;
	}

	public async delete(): Promise<Collection> {
		return this.model.where('_id', '=', this.id).delete();
	}

}

export default Collection
