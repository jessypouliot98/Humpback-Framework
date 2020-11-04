import BaseDatabaseType from '../../Database/Types/Base'
import * as DatabaseType from '../../Database/Types/Types'
import * as InputType from '../../Entities/InputTypes'
import { option } from '../../Entities/InputTypes/TypeBase'
import { Timestamp } from 'mongodb'

export type input = {
	type: InputType.TypeBase,
	match?: RegExp | RegExp[],
	label?: string,
	placeholder?: string,
	className?: string,
	style?: object,
	width?: number | string,
	options?: option[],
}

export type column = {
	name: string,
	type: BaseDatabaseType,
	defaultValue?: any,
	required?: boolean,
	input?: input,
}

export type dispatchableEvents = {
	creating?: any,
	created?: any,
	updating?: any,
	udpated?: any,
	deleting?: any,
	deleted?: any,
	saving?: any,
	saved?: any,
}

abstract class BaseModel {

	public static collection: string;

	public static columns: column[];

	public static useTimestamps = true;

	public static useSoftDeletes = true;

	public static get allColumns() {
		const columns = [...this.columns];

		if (this.useTimestamps) {
			columns.push({
				name: 'createdAt',
				type: DatabaseType.Timestamp,
				input: {
					type: InputType.TypeDateTime,
				},
			});
			columns.push({
				name: 'updatedAt',
				type: DatabaseType.Timestamp,
				input: {
					type: InputType.TypeDateTime,
				},
			});
		}

		if (this.useSoftDeletes) {
			columns.push({
				name: 'deletedAt',
				type: DatabaseType.Timestamp,
				input: {
					type: InputType.TypeDateTime,
				},
			});
		}

		return columns;
	}

	public static guarded: string[] = [];

	public static hidden: string[] = [];

	public static cascadeDeletes: string[] = [];

	public static dispatchesEvents: dispatchableEvents = {};

}

export default BaseModel
