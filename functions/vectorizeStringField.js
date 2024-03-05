exports = async function (changeEvent) {
    const doc = changeEvent.fullDocument;

    try {
        console.log(`Vectorizing text field of document with id: ${doc._id}`);

        const stringFieldNameToVec = context.values.get("stringFieldNameToVec");

        const embedding = await context.functions.execute("embedFunction", doc[stringFieldNameToVec]);

        const dbName = context.values.get("dbName");
        const collectionName = context.values.get("collectionName");
        
        if (embedding.length > 0) {

            const mongodb = context.services.get('mongodb-atlas');
            const db = mongodb.db(dbName);
            const collection = db.collection(collectionName);

            const result = await collection.updateOne(
                { _id: doc._id },
                {
                    $set: {
                        vector: embedding,
                    }
                }
            );

            if (result.modifiedCount === 1) {
                console.log("Successfully updated the document.");
            } else {
                console.log("Failed to update the document.");
            }
        } else {
            console.log(`Failed to receive embedding. Status code: ${response.statusCode}`);
        }

    } catch (err) {
        console.error(err);
    }
};




"exports = async function(changeEvent) {\
    const doc = changeEvent.fullDocument;\
\
    try {\
        console.log(\"Vectorizing text field of document with id: \" + doc._id);\
\
        const stringFieldNameToVec = context.values.get(\"stringFieldNameToVec\");\
\
        const embedding = await context.functions.execute(\"embedFunction\", doc[stringFieldNameToVec]);\
\
        const dbName = context.values.get(\"dbName\");\
        const collectionName = context.values.get(\"collectionName\");\
        \
        if (embedding.length > 0) {\
            const mongodb = context.services.get('mongodb-atlas');\
            const db = mongodb.db(dbName); \
            const collection = db.collection(collectionName); \
\
            const result = await collection.updateOne(\
                { _id: doc._id },\
                { $set: { \
                  vector: embedding, \
                }}\
            );\
\
            if(result.modifiedCount === 1) {\
                console.log(\"Successfully updated the document.\");\
            } else {\
                console.log(\"Failed to update the document.\");\
            }\
        } else {\
            console.log(\"Failed to receive embedding.\");\
        }\
\
    } catch(err) {\
        console.error(err);\
    }\
};"
