import User from '../src/App/Model/User/User'
import File from '../src/App/Model/File/File'
import Migrator from '../src/Database/Migrator/Migrator'
import { ObjectId } from 'mongodb';

(async () => {
    const user = await User.query().whereRaw({ _id: new ObjectId('5fa0ccc3ee71951d54affabb') }).first();

    console.log(user)

    process.exit()
})()
