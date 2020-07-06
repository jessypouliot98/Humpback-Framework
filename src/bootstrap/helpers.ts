import Request from '../app/Request/Request'

export function dd(property: any){
	if( Request.current ){
		Request.send(property);
	}

	console.log(property);
	throw new Error('Dump & Die !');
};
