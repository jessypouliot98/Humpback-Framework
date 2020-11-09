import crypto, { HexBase64Latin1Encoding } from 'crypto'
import Config from '../Config/Config'

class Hash {

	public static SALT = Config.app.APP_KEY;
	public static ALGORITHM = 'sha512';
	public static DIGEST: HexBase64Latin1Encoding = 'base64';

	public static make(string: string): string {
		return crypto.createHash(Hash.ALGORITHM).update(Hash.SALT + string).digest(Hash.DIGEST);
	}

}

export default Hash
