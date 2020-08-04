abstract class BaseModel {

	public static collection: string;

	public static columns: object;

	public static useTimestamps = true;

	public static useSoftDeletes = true;

	public static get allColumns() {
		const timestampColumns = this.useTimestamps ? {
			createdAt: String,
			updatedAt: String,
		} : undefined;

		const deleteColumns = this.useSoftDeletes ? {
			deletedAt: String,
		} : undefined;

		return {
			...this.columns,
			...timestampColumns,
			...deleteColumns
		}
	}

	public static guarded: string[] = [];

	public static hidden: string[] = [];

	public static cascadeDeletes: string[] = [];

	public static dispatchesEvents = {};

}

export default BaseModel
