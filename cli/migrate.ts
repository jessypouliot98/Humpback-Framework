import * as path from 'path'
import * as fs from 'fs'

const MIGRATIONS_PATH = path.join(process.cwd(), './database/Migrations');

function isFileSupported(file = '') {
	if (typeof file !== 'string') {
		return false;
	}

	return /\.(js|ts)$/.test(file);
}

export default function() {
	fs.readdir(MIGRATIONS_PATH, async(error, files) => {
		if (error) {
			throw error;
		}

		for (const file of files) {
			if (!isFileSupported(file)) {
				continue;
			}

			let script = await import(path.resolve(MIGRATIONS_PATH, file));

			if (!script.default) {
				continue;
			}

			script = script.default;

			const migrator = new script();

			if (typeof migrator.handle !== 'function') {
				continue;
			}

			await migrator.handle();
		}

	});
}
