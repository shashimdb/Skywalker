// DataService.ts
import axios, { AxiosResponse } from 'axios';

export default class DataService {
  private apiUrl: string;

 

  constructor() {
  
    this.apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";
}

 // Done
  public async handleSearch(data: any): Promise<AxiosResponse<any>> {
    const requestBody = { data };
    return await axios.post(`${this.apiUrl}/search`, requestBody);
  }

  // Done
  public async handleFindOppo(data: any): Promise<AxiosResponse<any>> {
    const requestBody = { data };
    return await axios.post(`${this.apiUrl}/findOppo`, requestBody);
  }


  // Done
  public async handleUserSizingList(data: any): Promise<AxiosResponse<any>> {
    const requestBody = { data };
    return await axios.post(`${this.apiUrl}/fetchLatestSizing`, requestBody);
  }

  // Done
  public async handleInsertDoc(data: any): Promise<AxiosResponse<any>> {
    const requestBody = { data };
    return await axios.post(`${this.apiUrl}/insertDoc`, requestBody);
  }

  // Done
  public async handleUpdatetDoc(filterData: any, setData: any): Promise<AxiosResponse<any>> {
    const requestBody = { filter: filterData, update: setData };
    return await axios.post(`${this.apiUrl}/updateDoc`, requestBody);
  }

  // Done
  public async handleDeleteDoc(filterData: any): Promise<AxiosResponse<any>> {
    const requestBody = { data: filterData };
    return await axios.post(`${this.apiUrl}/deleteDoc`, requestBody);
  }

  // Done same as handleDeleteDoc
  public async handleDeleteCol(filterData: any): Promise<AxiosResponse<any>> {
    const requestBody = { data: filterData };
    return await axios.post(`${this.apiUrl}/deleteManyDoc`, requestBody);
  }

  // Done
  public async handleReadManyDoc(filterData: any): Promise<AxiosResponse<any>> {
    const requestBody = { data: filterData };
    return await axios.post(`${this.apiUrl}/readManyDoc`, requestBody);
  }

  public async handleFetchWorkloads(filterData: any): Promise<AxiosResponse<any>> {
    const requestBody = { data: filterData };
    return await axios.post(`${this.apiUrl}/fetchworkloads`, requestBody);
  }
}
