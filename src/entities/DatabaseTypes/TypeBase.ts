abstract class TypeBase {

	protected static type: string

	public static toString(): string {
		if (!this.type) {
			return this.name.toLowerCase().replace(/^type/, '');
		}

		return this.type;
	}

	public static value(prop: any) {
		return prop;
	}

}

export default TypeBase
