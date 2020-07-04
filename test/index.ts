import BaseConfig from '../src/app/BaseConfig/BaseConfig'
import Storage from '../src/app/Storage/Storage'
import Auth from '../src/app/Auth/Auth'
import User from '../src/app/Model/presets/User/User'
import Route from '../src/app/Route/Route'
import UserController from '../src/app/Controller/presets/UserController/UserController'
import Humpback from '../src/app/Humpback/Humpback'

const app = Humpback.start();

app.attachRoutes([
	Route.prefix('/api/v1', [
		Route.get('', [UserController, 'store']),
		Route.get('/test', () => 'hello world'),
		Route.get('/bob', () => 'hello bob')
	]),
	Route.prefix('/api/v2', [
		Route.get('', [UserController, 'store']),
		Route.get('/test', () => 'hello world'),
		Route.get('/bob', () => 'v2 hello bob')
	]),
])
