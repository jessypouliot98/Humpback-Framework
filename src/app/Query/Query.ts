import { whereArgs } from './types'

class Query {

	protected _model: any;

	protected state: { where: whereArgs|null } = {
		where: null,
	}

	constructor(model: any){
		this._model = model;
	}

	public setWhere(args: whereArgs): void {
		this.state.where = args;
	}

}

export default Query;
