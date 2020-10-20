import crypto, { HexBase64Latin1Encoding } from 'crypto';
import Config from '../Config/Config'

class Hash {

	static SALT = Config.app.APP_KEY;

	public static make(string: string): string {
		return crypto.createHash('sha512').update(Hash.SALT + string).digest('base64');
	}

}

export default Hash
