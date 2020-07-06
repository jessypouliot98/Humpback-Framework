import Exception from '../Exception/Exception'

class NullException extends Exception {

	public static noValueFor(prop: string, type?: string){
		if( type ){
			return new this().error(`Unexpected null value found for [${prop}] with expected type of [${type}]`);
		} else {
			return new this().error(`Unexpected null value found for [${prop}]`);
		}
	}

}

export default NullException
