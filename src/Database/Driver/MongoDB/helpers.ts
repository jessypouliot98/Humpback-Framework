import BaseDatabaseType from '../../Types/Base';

type validator = object;

enum BSONType {
    ObjectId = 'objectId',
    String = 'string',
    Timestamp = 'timestamp',
    Array = 'array',
    Boolean = 'bool',
    Decimal = 'decimal',
    Double = 'double',
    Int = 'int',
    BigInt = 'long',
    Object = 'object',
    Null = 'null',
}

export function getType(type: typeof BaseDatabaseType): [BSONType, object[] | null] {
    switch (type.toString()) {
        case 'id':
            return [BSONType.ObjectId, null];

        case 'string':
            return [BSONType.String, null];

        case 'timestamp':
            return [BSONType.Timestamp, null];

        case 'array':
            return [BSONType.Array, null];

        case 'boolean':
            return [BSONType.Boolean, null];

        case 'float':
            return [BSONType.Decimal, null];

        case 'int':
            return [BSONType.Int, null];

        case 'object':
            return [BSONType.Object, null];

        default:
            throw new Error(`Invalid DatabaseType ${type.toString()}`);
    }
}

export function getRequired(properties: any[]): string[] {
    return properties.filter(prop => prop.required).map(prop => prop.name);
}

export function getValidator(schema: any[]): validator {
    const objectSchema = schema.reduce<validator>((accumulator, column) => {
        const [bsonType, properties] = getType(column.type);

        const required = properties ? getRequired(properties) : undefined;

        const objectProperties = properties ? getValidator(properties) : undefined;

        accumulator[column.name] = {
            bsonType: bsonType.toString(),
            required,
            properties: objectProperties,
        }

        return accumulator;
    }, {});

    return objectSchema;
}
