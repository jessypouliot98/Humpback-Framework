import TypeBase from './TypeBase'
import { Int32 } from 'mongodb'

class TypeInt extends TypeBase {

	protected static type = 'int';

	public static value(prop) {
		return new Int32(parseInt(prop));
	}

}

export default TypeInt
