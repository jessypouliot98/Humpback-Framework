import * as path from 'path'
import * as fs from 'fs'

const SEEDERS_PATH = path.join(process.cwd(), './database/Seeders');

function isFileSupported(file = '') {
	if (typeof file !== 'string') {
		return false;
	}

	return /\.(js|ts)$/.test(file);
}

export default function() {
	fs.readdir(SEEDERS_PATH, async(error, files) => {
		if (error) {
			throw error;
		}

		for (const file of files) {
			if (!isFileSupported(file)) {
				continue;
			}

			let script = await import(path.resolve(SEEDERS_PATH, file));

			if (!script.default) {
				continue;
			}

			script = script.default;

			const seeder = new script();

			if (typeof seeder.handle !== 'function') {
				continue;
			}

			await seeder.handle();
		}

	});
}
