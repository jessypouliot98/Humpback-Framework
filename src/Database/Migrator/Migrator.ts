import Model from '../../App/Model/Model'
import Db from '../Db/Db'

class Migrator {

    public static getModelSchema(model: typeof Model) {
        const columns = model.getColumns();

        const schema = columns.map(column => {
            return {
                name: column.name,
                type: column.type,
                required: column.nullable ? false : true,
                defaultValue: column.defaultValue || null,
            }
        });

        return schema;
    }

    public static async sync(model: typeof Model) {
        const schema = this.getModelSchema(model);

        await Db.collection(model.collection).createSchema(schema);
    }

}

export default Migrator
