export type option = {
	label: string,
	value: string | number,
}

abstract class TypeBase {

	protected static type: string

	public static match: RegExp[] = [];

	public static toString(): string {
		if (!this.type) {
			return this.name.toLowerCase().replace(/^type/, '');
		}

		return this.type;
	}

}

export default TypeBase
