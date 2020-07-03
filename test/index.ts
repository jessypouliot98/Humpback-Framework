import BaseConfig from '../src/app/BaseConfig/BaseConfig'
import Storage from '../src/app/Storage/Storage'
import Auth from '../src/app/Auth/Auth'
import User from '../src/app/Model/presets/User/User'
import Route from '../src/app/Route/Route'
import UserController from '../src/app/Controller/presets/UserController/UserController'

import express from 'express'
const app = express();
const port = 8080; // default port to listen

// start the Express server
app.listen( port, () => {
	console.log( `server started at http://localhost:${ port }` );
} );

app.use(
	Route.prefix('/api/v1', [
		Route.get('', [UserController, 'store']),
		Route.get('/test', () => 'hello world'),
		Route.get('/bob', () => 'hello bob')
	])
)
