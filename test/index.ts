import Route from '../src/app/Http/Route/Route'
import UserController from '../src/app/Http/Controller/UserController/UserController'
import PageController from '../src/app/Http/Controller/PageController/PageController'
import PostController from '../src/app/Http/Controller/PostController/PostController'
import Humpback from '../src/app/Humpback/Humpback'

const app = Humpback.start();

app.attachRoutes([
	Route.prefix('/api/v1', [
		Route.get('/user', [UserController, 'index']),
		Route.get('/user/:id', [UserController, 'show']),
		Route.get('/page', [PageController, 'index']),
		Route.get('/page/:id', [PageController, 'show']),
		Route.get('/post', [PostController, 'index']),
		Route.get('/post/:id', [PostController, 'show']),
	]),
])
