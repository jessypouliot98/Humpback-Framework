import TypeBase from './TypeBase'

class TypeString extends TypeBase {

	protected static type = 'string';

	public static value(prop) {
		return prop.toString();
	}

}

export default TypeString
