// const { OpenAI } = require("openai");

// const openai = new OpenAI({
//     apiKey: "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"
//   });

// async function generateOpenAIEmbeddings(stringToVectorize){

//   try {
//     const embedding = await openai
//       .embeddings.create({
//         model: "text-embedding-ada-002",
//         input: stringToVectorize,
//         encoding_format: "float"
//       }).then((response) => response.data[0]["embedding"]);
//     // console.log(embedding);
//     return embedding;
//   } catch (err) {
//     console.error(`Could not generate embeddings: ${err}`);
//   }
// };

exports = async function(stringToVectorize) {

    const openai_url = 'https://api.openai.com/v1/embeddings';
    
    const openai_key = context.values.get("openAIKey");

    try {
        console.log("OpenAI Vectorizing: " + stringToVectorize);

        let response = await context.http.post({
            url: openai_url,
             headers: {
                'Authorization': [`Bearer ${openAIKey}`],
                'Content-Type': ['application/json']
            },
            body: JSON.stringify({
                input: stringToVectorize,
                model: "text-embedding-ada-002"
            })
        });
        
        let responseData = EJSON.parse(response.body.text());
        
        if(response.statusCode === 200) {
            console.log("Successfully received embedding.");

            const embedding = responseData.data[0].embedding;
            
            console.log(JSON.stringify(embedding));

            return embedding;

        } else {
            console.log(`Failed to receive embedding. Status code: ${response.statusCode}`);
        }

    } catch(err) {
        console.error(err);
    }
};