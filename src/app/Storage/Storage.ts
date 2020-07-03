import BaseConfig from '../BaseConfig/BaseConfig'

class Storage {

	protected state = {
		disk: BaseConfig.storage.STORAGE_DISK
	}

	public exists(filePath: string): boolean {
		return !!filePath;
	}

	public static exists(filePath: string): boolean {
		return new this().exists(filePath);
	}

	public get(filePath: string): any {
		return filePath;
	}

	public static get(filePath: string): any {
		return new this().get(filePath);
	}

	public store(filePath: string, fileContent: string): boolean {
		return !!filePath && !!fileContent;
	}

	public static store(filePath: string, fileContent: string): boolean {
		return new this().store(filePath, fileContent);
	}

	public replace(filePath: string, fileContent: string): boolean {
		return !!filePath && !!fileContent;
	}

	public static replace(filePath: string, fileContent: string): boolean {
		return new this().replace(filePath, fileContent);
	}

	public delete(filePath: string): boolean {
		return !!filePath;
	}

	public static delete(filePath: string): boolean {
		return new this().delete(filePath);
	}

}

export default Storage
