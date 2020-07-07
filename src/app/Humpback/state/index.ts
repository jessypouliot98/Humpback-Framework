import Request from '../../Http/Request/Request'

const state: {
	http: {
		request: Request|null
	},
	db: {
		connection: any|null
	}
} = {
	http: {
		request: null
	},
	db: {
		connection: null,
	},
}

export default state
