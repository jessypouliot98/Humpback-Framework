import dotenv from 'dotenv'
import path from 'path'

dotenv.config();

const env = process.env;

class BaseConfig {

	static get app(): any {
		const APP_HOST = env.APP_HOST || '127.0.0.1';
		const APP_PORT = env.APP_PORT || '8000';

		return {
			APP_NAME: env.APP_NAME || 'Humpback app',
			APP_HOST,
			APP_PORT,
			APP_KEY: env.APP_KEY || '',
			APP_SALT: env.APP_SALT || '',
		}
	}

	static get path(): any {
		const getPath = (p: string) => path.join( process.cwd(), p );

		const PUBLIC_URL = env.PUBLIC_PATH || '/public';
		const STORAGE_URL = env.STORAGE_PATH || '/storage';

		return {
			PUBLIC_URL,
			PUBLIC_URI: getPath( PUBLIC_URL ),
			STORAGE_URL,
			STORAGE_URI: getPath( PUBLIC_URL + STORAGE_URL ),
			VIEW_URI: getPath( (env.VIEW_PATH || '/resources/views') )
		};
	}

	static get db(): any {
		return {
			DB_DRIVER: env.DB_DRIVER || 'mongodb',
			DB_HOST: env.DB_HOST || '127.0.0.1',
			DB_PORT: env.DB_PORT || '27017',
			DB_NAME: env.DB_NAME || '',
			DB_USERNAME: env.DB_USERNAME || '',
			DB_PASSWORD: env.DB_PASSWORD || '',
		}
	}

	static get mail(): any {
		return {
			MAIL_DRIVER: env.MAIL_DRIVER || 'smtp',
			MAIL_HOST: env.MAIL_HOST || '',
			MAIL_PORT: env.MAIL_PORT || '',
			MAIL_USERNAME: env.MAIL_USERNAME || '',
			MAIL_PASSWORD: env.MAIL_PASSWORD || '',
			MAIL_ENCRIPTION: env.MAIL_ENCRIPTION || 'tls',
		}
	}

	static get storage(): any {
		return {
			STORAGE_DISK: env.STORAGE_DISK || 'local',
			STORAGE_MAX_UPLOAD_SIZE: env.STORAGE_MAX_UPLOAD_SIZE || 2024,
		}
	}

}

export default BaseConfig
