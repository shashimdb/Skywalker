from pymongo import MongoClient
from flask import Flask, request, jsonify
import time

app = Flask(__name__)


@app.route('/index_collection', methods=['POST'])
def index():
    req = request.get_json()
    mongo_conn_str = req["mongoConnStr"]
    db_name = req["dbName"]
    collection_name = req["collectionName"]
    fields = req["fields"]
    mongo_client = MongoClient(mongo_conn_str)
    output_collection = mongo_client[db_name][collection_name]
    
    """
    const requestBody = {
      "collectionName": collectionName,
      "database": databaseName,
      "name": "skywalkerIdx",
      "type": "vectorSearch",
      "fields": [{
        "type": "vector",
        "path": "embedding",
        "numDimensions": 1536,
        "similarity": "euclidean"
      }]
    };
    """

    schema = {
        "name": "skywalkeridx",
        "definition": {"mappings": {"dynamic": True,"fields": fields}}
        }

    print(len(list(output_collection.find({},{"_id":1}))))
    if output_collection.count_documents({}) > 0:
        output_collection.create_search_index(schema)
        cnt = 0
        while cnt<120:
            out = list(output_collection.list_search_indexes())[0]
            if out['status'].lower!='pending':
                return jsonify(message=out)
            time.sleep(1)
            cnt += 1
    else:
        return jsonify(message="No documents in collection. Failed to create index!!!")

if __name__ == '__main__':
    app.run(debug=True)
