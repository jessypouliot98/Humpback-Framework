import Exception from '../Exception/Exception'

class DatabaseException extends Exception {

	public static notInitialized(){
		return new this().error('Trying to access database driver that was not initialized');
	}

}

export default DatabaseException
