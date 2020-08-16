import TypeBase from './TypeBase'

class TypeBoolean extends TypeBase {

	protected static type = 'boolean';

	public static value(prop) {
		if (typeof prop !== 'boolean') {
			return null;
		}

		return prop;
	}

}

export default TypeBoolean
