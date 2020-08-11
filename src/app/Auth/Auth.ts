import User from '../Model/User/User'
import Request from '../Http/Request/Request'
import Config from '../Config/Config'
import Jwt from 'jsonwebtoken'

class Auth {

	public static createToken(user: User): string {
		const payload = {
			_id: (user as any).id,
			_email: (user as any).email,
		};

		return Jwt.sign(payload, Config.app.APP_KEY);
	}

	public static parseToken(token?: string): object|string|null  {
		if( !token ){
			if (!Request.current || !Request.current.bearerToken) {
				return null;
			}

			token = Request.current.bearerToken;
		}


		if( typeof token === 'string' && token.startsWith('Bearer ') ){
			token = token.slice(7, token.length);
		}

		return Jwt.verify(token, Config.app.APP_KEY) || null;
	}

	public static validateToken(token?: string): boolean  {
		return !!this.parseToken(token);
	}

	public static async user(token?: string): Promise<User|null> {
		const parsedToken = Auth.parseToken(token) as any;
		if( !parsedToken && !parsedToken._email ) return null;

		const user = await User.where('email', '=', parsedToken._email).first();

		return user;
	}

}

export default Auth
