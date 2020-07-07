import state from '../app/Humpback/state'

declare module NodeJS  {
	interface Global {
		__HUMPBACK__: { state: state },
	}
}
