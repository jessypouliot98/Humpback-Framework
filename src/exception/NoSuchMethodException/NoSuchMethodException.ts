import Exception from '../Exception/Exception'

class NoSuchMethodException extends Exception {

	public static routeDelegate(){
		return new this().error('Cannot find any Route callback delegate');
	}

}

export default NoSuchMethodException
