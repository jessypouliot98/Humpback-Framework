import { User } from '../../../Model'
import Request from '../../Request/Request'
import Middleware from '../Middleware'
import Config from '../../../Config/Config'
import Jwt from 'jsonwebtoken'

class Auth extends Middleware {

	public static createToken(user: User): string {
		const payload = {
			_id: (user as any).id,
			_name: (user as any).name,
			_email: (user as any).email,
		};

		return Jwt.sign(payload, Config.app.APP_KEY);
	}

	public static validateToken(token?: string): boolean  {
		return !!this.parseToken(token);
	}

	public static parseToken(token?: string): object|string|null  {
		if( !token ){
			if( !Request.current || !Request.current.bearerToken ) return null;
			token = Request.current.bearerToken;
		}


		if( typeof token === 'string' && token.startsWith('Bearer ') ){
			token = token.slice(7, token.length);
		}

		return Jwt.verify(token, Config.app.APP_KEY) || null;
	}

	/**
	*	Get current authenticated user or return null if no user is authenticated
	*
	*	@return Model|null - Authenticated user
	*/
	public static async user(token?: string): Promise<User|null> {
		const parsedToken = Auth.parseToken(token) as any;
		if( !parsedToken && !parsedToken._email ) return null;

		const user = await User.where('email', '=', parsedToken._email).first();

		return user;
	}

	// Middlewares

	public static isLoggedIn(req, res, next): void {
		if( !this.validateToken(req.headers?.bearer) ){
			res.json({
				success: false,
				message: 'Invalid token'
			});
			return;
		}

		next();
	}

}

export default Auth
