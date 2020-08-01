import User from '../../../Model/User/User'
import Request from '../../Request/Request'
import Middleware from '../Middleware'
import Config from '../../../Config/Config'
import Jwt from 'jsonwebtoken'
import Collection from '../../../../Entities/Collection/Collection'

class Auth extends Middleware {

	public static createToken(user: Collection): string {
		const payload = {
			_id: user.id,
			_name: user.entries.name,
			_email: user.entries.email,
		};

		return Jwt.sign(payload, Config.app.APP_KEY);
	}

	public static validateToken(token?: string): boolean  {
		return !!Auth.parseToken(token);
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
	*	@return Collection|null - Authenticated user
	*/
	public static async user(token?: string): Promise<Collection|null> {
		const parsedToken = Auth.parseToken(token) as any;
		if( !parsedToken && !parsedToken._email ) return null;

		const user = await User.where('email', '=', parsedToken._email).first();

		return user.entries ? user : null;
	}

	// Middlewares

	public static isLoggedIn(req, res, next): void {
		if( !Auth.validateToken(req.headers?.bearer) ){
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
