import Request from '../../Request/Request'

export type httpState = {
	request: Request|null,
}

const state: httpState = {
	request: null,
}

export default state
