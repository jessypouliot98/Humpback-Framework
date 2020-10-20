import Config from '../Config/Config'
import fs, { promises as pfs } from 'fs'

class Storage {

	protected state = {
		debug: false,
		disk: Config.storage.STORAGE_DISK
	}

	/* DEBUG */

	public debug(active: boolean = true): Storage {
		this.state.debug = active;
		return this;
	}

	public static debug(active: boolean = true): Storage {
		return new this().debug(active);
	}

	/* DISK */

	public disk(diskName: string): Storage {
		this.state.disk = diskName;
		return this;
	}

	public static disk(diskName: string): Storage {
		return new this().disk(diskName);
	}

	/* EXISTS */

	public exists(filePath: string): Promise<boolean> {
		return new Promise((resolve) => {
			fs.exists(filePath, resolve);
		});
	}

	public static async exists(filePath: string): Promise<boolean> {
		return new this().exists(filePath);
	}

	/* GET */

	public async get(filePath: string): Promise<any> {
		return await pfs.readFile(filePath);
	}

	public static async get(filePath: string): Promise<any> {
		return new this().get(filePath);
	}

	/* STORE */

	public async store(fileContent: string, filePath: string, options?: any): Promise<boolean> {
		try {
			await pfs.writeFile(filePath, fileContent, options);

			return true;
		} catch(err){
			if (this.state.debug) {
				console.error(err);
			}

			return false;
		}
	}

	public static async store(fileContent: string, filePath: string, options?: any): Promise<boolean> {
		return new this().store(fileContent, filePath, options);
	}

	/* DELETE */

	public async delete(filePath: string): Promise<boolean> {
		try {
			await pfs.unlink(filePath);

			return true;
		} catch(err) {
			if (this.state.debug) {
				console.error(err);
			}

			return false;
		}
	}

	public static async delete(filePath: string): Promise<boolean> {
		return new this().delete(filePath);
	}

	/* COPY */

	public async copy(filePath: string, destinationPath: string): Promise<boolean> {
		try {
			await pfs.copyFile(filePath, destinationPath);

			return true;
		} catch(err) {
			if (this.state.debug) {
				console.error(err);
			}

			return false;
		}
	}

	public static async copy(filePath: string, destinationPath: string): Promise<boolean> {
		return new this().copy(filePath, destinationPath);
	}

	/* MOVE */

	public async move(filePath: string, destinationPath: string): Promise<boolean> {
		try {
			await pfs.rename(filePath, destinationPath);

			return true;
		} catch(err) {
			if (this.state.debug) {
				console.error(err);
			}

			return false;
		}
	}

	public static async move(filePath: string, destinationPath: string): Promise<boolean> {
		return new this().move(filePath, destinationPath);
	}

}

export default Storage
