// DataService.ts
import axios, { AxiosResponse } from 'axios';
import { OpenAIEmbeddings } from "@langchain/openai";

export default class DataService {
  private apiUrl: string;
  public ACCESS_TOKEN: string | undefined;
  private adminAPIUrl: string;
  public OpenAI_Key!: string;


  constructor() {

    this.apiUrl = "https://services.cloud.mongodb.com/api/admin/v3.0";
    this.adminAPIUrl = "https://cloud.mongodb.com/api/atlas/v2"
  }

  // Handle Login
  public async handleLogin(data: any): Promise<AxiosResponse<any>> {
    const requestBody = data;
    return await axios.post(`${this.apiUrl}/auth/providers/mongodb-cloud/login`, requestBody);
  }

  // Create App Service
  public async handleCreateApp(groupId: any): Promise<AxiosResponse<any>> {
    const requestBody = { "name": "skywalkerVectorApp" };
    return (await axios.post(`${this.apiUrl}/groups/${groupId}/apps`, requestBody,
      {
        headers: {
          Authorization: `Bearer ${this.ACCESS_TOKEN}`
        }
      }));
  }


  // Create Function
  public async handleCreateFunction(groupId: any, appId: any, functionName: any, source: any): Promise<AxiosResponse<any>> {
    const requestBody = {
      "name": functionName,
      "private": false,
      "source": source
    };
    return (await axios.post(`${this.apiUrl}/groups/${groupId}/apps/${appId}/functions`, requestBody,
      {
        headers: {
          Authorization: `Bearer ${this.ACCESS_TOKEN}`
        }
      }));
  }

  // Create Trigger
  public async handleCreateTrigger(groupId: any, appId: any, functionId: any, databaseName: any, collectionName: any, service_id: any): Promise<AxiosResponse<any>> {
    const requestBody = {
      "name": "vectorizeStringField",
      "type": "DATABASE",
      "config": {
        "operation_types": ["INSERT"],
        "database": databaseName,
        "collection": collectionName,
        "service_id": service_id,
        "match": { },
        "full_document": true
      },
      "function_id": functionId
    };
    console.log(requestBody)
    return (await axios.post(`${this.apiUrl}/groups/${groupId}/apps/${appId}/triggers`, requestBody,
      {
        headers: { Authorization: `Bearer ${this.ACCESS_TOKEN}` }
      }));
  }


  // Create Auth Proivder 
  public async handleAuthProvider(groupId: any, appId: any): Promise<AxiosResponse<any>> {
    const requestBody = {
      "name": "anon-user",
      "type": "anon-user",
      "disabled": false
    };
    return (await axios.post(`${this.apiUrl}/groups/${groupId}/apps/${appId}/auth_providers`, requestBody,
      {
        headers: {
          Authorization: `Bearer ${this.ACCESS_TOKEN}`
        }
      }));
  }

  // Link Datasource
  public async handleLinkDataSource(groupId: any, appId: any, clusterName: any): Promise<AxiosResponse<any>> {
    const requestBody = {
      "name": "vector-data",
      "type": "mongodb-atlas",
      "config": {
        "clusterName": clusterName,
        "readPreference": "primary",
        "wireProtocolEnabled": true
      }
    };
    return (await axios.post(`${this.apiUrl}/groups/${groupId}/apps/${appId}/services`, requestBody,
      {
        headers: {
          Authorization: `Bearer ${this.ACCESS_TOKEN}`
        }
      }));
  }


  // Create Rule
  public async handleCreateRule(groupId: any, appId: any, database: any, collection: any, serviceId: any): Promise<AxiosResponse<any>> {
    const requestBody = {
      "database": database,
      "collection": collection,
      "roles": [
        {
          "read": true,
          "write": true,
          "insert": true,
          "delete": true,
          "search": true,
        }
      ]
    };
    return (await axios.post(`${this.apiUrl}/groups/${groupId}/apps/${appId}/services/${serviceId}/rules`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${this.ACCESS_TOKEN}`
        }
      }));
  }

  // Create Values

  public async handleCreateValues(groupId: any, appId: any, keyValue: any, keyName: any): Promise<AxiosResponse<any>> {
    const requestBody = {
      "name": keyName,
      "private": false,
      "value": keyValue
    };
    return (await axios.post(`${this.apiUrl}/groups/${groupId}/apps/${appId}/values`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${this.ACCESS_TOKEN}`
        }
      }));
  }



  // Create Index
  public async handleCreateIndex(groupId: any, clusterName: any, collectionName: any, databaseName: any, fieldName: any): Promise<AxiosResponse<any>> {
    const username = "osvacnkq"
    const apiKey = "ff21ed27-7943-40ef-a401-0fb472bbe358"
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
    return await axios.post(
      `${this.adminAPIUrl}/groups/${groupId}/clusters/${clusterName}/fts/indexes`,
      requestBody,
      {
        headers: {
          "Authorization": `Digest ${username}:${apiKey}`,
          "Accept": "application/vnd.atlas.2023-01-01+json",
          "Access-Control-Allow-Origin": '*',
          "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token"
        }
      });
  }


  // Generate Embeddings
  // public async getEmbeddings(doc: any, openai_key: string): Promise<AxiosResponse<any>> {
  //   const url = 'https://api.openai.com/v1/embeddings';
  //   const requestBody = {
  //     model: "text-embedding-3-small",
  //     input: doc,
  //   };

  //   const headers = {
  //     'Authorization': `Bearer ${openai_key}`,
  //     'Content-Type': 'application/json',
  //   };

  //   try {
  //     return await axios.post(url, requestBody, { headers });
  //   } catch (error) {
  //     // Handle error
  //     console.error('Error occurred while fetching embeddings:', error);
  //     throw error;
  //   }
  // }

  public async getEmbeddings(text:any, openai_key:any) {
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: openai_key, // In Node.js defaults to process.env.OPENAI_API_KEY
      batchSize: 512, // Default value if omitted is 512. Max is 2048
      modelName: "text-embedding-3-small",
    });
    const vectors = await embeddings.embedDocuments(text);
    return vectors;
  }

}
