import express from 'express'
import Route from '../../App/Http/Route/Route'
import BaseConfig from '../../App/BaseConfig/BaseConfig'
import state from './State'
import 'colors'

class Humpback {

	protected _app: any;

	constructor(){
		this.initialise();
	}

	public static start(){
		return new this();
	}

	public static get state() {
		return (global as any).__HUMPBACK__;
	}

	public static set state(state: any) {
		(global as any).__HUMPBACK__ = state;
	}

	protected initialise(){
		Humpback.state = state;
		this._app = express();

		this.listenToPort();
	}

	protected listenToPort(){
		this._app.listen( BaseConfig.app.APP_PORT, BaseConfig.app.APP_HOST, () => {
			console.log(`\nHTTP Server running at [${BaseConfig.app.APP_HOST.yellow}] on port [${BaseConfig.app.APP_PORT.toString().yellow}]\n`);
		} );
	}

	public attachRoute(route: Route){
		this._app.use(route);
	}

	public attachRoutes(routes: Route[]){
		routes.forEach(route => {
			this.attachRoute(route);
		})
	}

}

export default Humpback
