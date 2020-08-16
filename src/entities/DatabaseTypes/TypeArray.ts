import TypeBase from './TypeBase'

class TypeArray extends TypeBase {

	protected static type = 'array';

	public static value(prop) {
		if (!Array.isArray(prop)) {
			return null;
		}

		return prop;
	}

}

export default TypeArray
