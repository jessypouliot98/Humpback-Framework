class Exception {

	public static default(message: string){
		return new this().error(message);
	}

	protected error(message: string){
		return new Error(`[${this.constructor.name}] - ${message}`);
	}

}

export default Exception
