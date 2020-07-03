class Request {

	static get current(): Request {
		return new this();
	}

}

export default Request
