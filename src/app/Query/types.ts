import { ObjectID } from 'mongodb'

export type connectionArgs = {
	DB_HOST: string,
	DB_PORT: string,
	DB_NAME: string,
	DB_USERNAME?: string,
	DB_PASSWORD?: string,
}
