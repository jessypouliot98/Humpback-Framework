import express from 'express'
import path from 'path'
import Route from '../Http/Route/Route'
import Config from '../Config/Config'
import state from './State'
import { enumViewEngines } from '../../Entities/View/View'
import { HumpbackHttp } from '../Http/Middleware'
import bodyParser from 'body-parser'
import cors from 'cors'
import 'colors'

class Humpback {

	protected _app: any;

	constructor() {
		this.initialise();
	}

	public static start() {
		return new this();
	}

	public static get state() {
		return (global as any).__HUMPBACK__;
	}

	public static set state(state: any) {
		(global as any).__HUMPBACK__ = state;
	}

	protected initialise() {
		Humpback.state = state;
		this._app = express();

		this.listenToPort();
		this.setupMiddlewares();
	}

	protected listenToPort() {
		this._app.listen( Config.app.APP_PORT, Config.app.APP_HOST, () => {
			console.log(`\nHTTP Server running at [${Config.app.APP_HOST.yellow}] on port [${Config.app.APP_PORT.toString().yellow}]\n`);
		} );
	}

	protected setupMiddlewares() {
		this._app.options('*', cors());
		this._app.use(function(req, res, next) {
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
			next();
		});
		this._app.use( bodyParser.urlencoded({ extended: false }) );
		this._app.use( bodyParser.json() );
		this._app.use( HumpbackHttp.setup );
	}

	public attachRoute(route: Route) {
		this._app.use(route);
	}

	public attachRoutes(routes: Route[]) {
		routes.forEach(route => {
			this.attachRoute(route);
		})
	}

	public setViewEngine(viewEngine: enumViewEngines = null, viewDirectory: string = path.join(process.cwd(), '/resources/views')) {
		if (!viewEngine) {
			return;
		}

		this._app.set('views', viewDirectory);
		this._app.set('view engine', viewEngine);
	}

}

export default Humpback
