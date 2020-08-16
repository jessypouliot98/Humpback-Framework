import TypeBase from './TypeBase'
import { Double } from 'mongodb'

class TypeFloat extends TypeBase {

	protected static type = 'float';

	public static value(prop) {
		return new Double(parseFloat(prop));
	}

}

export default TypeFloat
