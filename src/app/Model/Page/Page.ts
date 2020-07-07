import Model from '../Model'

class Page extends Model {

	public static collection = 'pages';

	public static columns = {
		title: String,
		slug: String,
		excerpt: String,
		content: String,
	}

}

export default Page
