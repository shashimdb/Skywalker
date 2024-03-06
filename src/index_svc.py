from pymongo import MongoClient
from flask import Flask, request, jsonify
import time
from langchain import PromptTemplate, LLMChain
from langchain.llms import OpenAI
from functools import lru_cache

app = Flask(__name__)

@lru_cache(1)
def get_rag_llm():
    template = """
    Answer the question based on the context and adhering to instruciton. If the
    question cannot be answered using the information provided answer
    with 'I don't know'.
    ### Context : {context}

    ### Question: {question}

    ### Instruction : {instruction}

    ### Answer:
    """
    prompt = PromptTemplate(template=template, input_variables=["question", "context","instruction"])
    llm_chain = LLMChain(prompt=prompt, llm=OpenAI(model="gpt-3.5-turbo"))
    return llm_chain


@app.route('/answer_question', methods=['POST'])
def answer_question():
    req = request.get_json()
    context = req['context']
    question = req['question']
    instruction = req['instruction']
    chain = get_rag_llm()
    result = chain({"question":question,"context":context,"instruction": instruction})
    return jsonify({"answer": result})

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
