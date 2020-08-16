import TypeBase from './TypeBase'

class TypeObject extends TypeBase {

	protected static type = 'object';

	public static value(prop) {
		if (typeof prop !== 'object' || !Object.keys(prop).length) {
			return null;
		}

		return prop as object;
	}

}

export default TypeObject
