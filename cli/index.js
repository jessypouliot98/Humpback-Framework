#!/usr/bin/env ts-node-script

const [,, command, ...params] = process.argv;

switch( command ){

	case 'seed':
		require('./seed').default(params);
		break;

	case 'migrate':
		require('./migrate').default(params);

	default:
		console.log(`No commands found for ${command}`);
		break;

}
