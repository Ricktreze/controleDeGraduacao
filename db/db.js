require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");

let singleton;

async function connect(){   
    if (singleton){ return singleton};
    const client = new MongoClient( process.env.MONGO_HOST);
    await client.connect();    
    singleton = client.db(process.env.MONGO_DATABASE);
    return singleton;
}

async function insert( entit, content ){
    const db = await connect();
    return db.collection(entit).insertOne( content );
}

async function find(entit,filter){
        const db = await connect();
        var cursor = db.collection(entit).find();
        if(filter){
            cursor = db.collection(entit).find(filter);
        }
        
    return await cursor.toArray();
}

async function findNome(entit, sort, filter, limit = 50){
        const db =       await connect();
        const cursor = db.collection(entit).find(filter).limit(limit).sort(sort);
    return await cursor.toArray();
}
async function remove(id,entit){
    const db = await connect();
    return db.collection(entit).deleteOne( {_id: new ObjectId(id) })
}

async function update(id, objUpdate, table ){
    const db = await connect();
    return db.collection(table).updateOne( {_id: new ObjectId(id) }, { $set: objUpdate })
}

async function findGraduacao(entit, filter, limit = 50){
        const db =       await connect();
        const cursor = db.collection(entit).find(filter).limit(limit);
    return await cursor.toArray();
}

// async function exists(table ){
//     const db = await connect();
//     const ret = db.collection(table).find().toArray();
//     return ret
// }

module.exports = {
    insert,
    find,
    findNome,
    update,
    remove,
    findGraduacao
}