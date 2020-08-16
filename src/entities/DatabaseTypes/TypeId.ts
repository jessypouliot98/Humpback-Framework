import TypeBase from './TypeBase'
import { ObjectID } from 'mongodb'

class TypeId extends TypeBase {

	protected static type = 'id';

	public static value(prop) {
		return new ObjectID(prop);
	}

}

export default TypeId
