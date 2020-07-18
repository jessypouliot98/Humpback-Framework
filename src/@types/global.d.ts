import state from '../App/Humpback/State'

declare module NodeJS  {
	interface Global {
		__HUMPBACK__: { state: state },
	}
}
