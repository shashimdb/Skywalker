exports = async function(searchString) {


    const dbName = context.values.get("dbName");
    const collectionName = context.values.get("collectionName");
    const stringFieldNameToVec = context.values.get("stringFieldNameToVec");
    const orders = context.services.get('vector-demo').db(dbName).collection(collectionName);
    
    const searchVector = await context.functions.execute("embedFunction", doc[stringFieldNameToVec]);
    
    var pipeline = [
      { $search: {
        index: "vector_euclidean",
        knnBeta: {
          vector: searchVector,
          path: stringFieldNameToVec,
          k: 10,
        }
      }}
    ];
  
    return await orders.aggregate(pipeline).toArray()
    .then(data => {
      console.log(data.length);
      return data;
    })
    .catch(err => {
      console.log(err.toString());
      return err.toString();
    });
  };