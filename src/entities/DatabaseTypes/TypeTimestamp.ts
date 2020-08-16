import TypeBase from './TypeBase'
import { Timestamp } from 'mongodb'

class TypeTimestamp extends TypeBase {

	protected static type = 'timestamp';

	public static value(prop) {
		return Timestamp.fromNumber(parseFloat(prop));
	}

}

export default TypeTimestamp
