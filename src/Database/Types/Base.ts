abstract class Base {

	protected static type: string

	public static toString(): string {
		if (!this.type) {
			return this.name.toLowerCase().replace(/^/, '');
		}

		return this.type;
	}
}

export default Base
