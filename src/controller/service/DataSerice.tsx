// DataService.ts
import axios, { AxiosResponse } from 'axios';

export default class DataService {
  private apiUrl: string;
  public ACCESS_TOKEN: string | undefined;


  constructor() {

    this.apiUrl = process.env.REACT_APP_API_URL || "https://services.cloud.mongodb.com/api/admin/v3.0";
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
  public async handleCreateFunction(groupId: any, appId: any): Promise<AxiosResponse<any>> {
    const requestBody = {
      "name": "vectorizingFunction",
      "private": false,
      "source": "exports = ({ token, tokenId, username, password }) => \
       { console.log(`Please visit the Skywalker to fully configure your password reset function`); \
       return { status: 'fail' };\
      };"
    };
    return (await axios.post(`${this.apiUrl}/groups/${groupId}/apps/${appId}/functions`, requestBody,
      {
        headers: {
          Authorization: `Bearer ${this.ACCESS_TOKEN}`
        }
      }));
  }

  //TODO: To be changed 
  // Create Trigger
  public async handleCreateTrigger(groupId: any, appId: any, functionId: any): Promise<AxiosResponse<any>> {
    const requestBody = {
      "name": "vectorizingFunction",
      "type": "DATABASE",
      "config": {
        "schedule": "0 8 * * *"
      },
      "functionId": functionId
    };
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
  public async handleCreateRule(groupId: any, appId: any, database: any, collection: any, serviceId: any ): Promise<AxiosResponse<any>> {
    const requestBody = {
      "database": database,
      "collection": collection
    };
    return (await axios.post(`${this.apiUrl}/groups/${groupId}/apps/${appId}/services/${serviceId}/rules`, 
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${this.ACCESS_TOKEN}`
        }
      }));
  }
}
