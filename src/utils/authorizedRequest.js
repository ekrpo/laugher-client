import axios from "axios"
import Error from "../components/Error/Error.js"

class RequestResult{
    constructor(data, err){
        this.data = data
        this.err = err
    }
}

let headers = {
  accessToken: window.localStorage.getItem("accessToken"),
  refreshToken: window.localStorage.getItem("refreshToken")
}
let config = {
  headers: headers
}

export async function authorizedGetRequest(requestUrl, accessToken){
  config.headers.accessToken = accessToken
  try{
      const initialResponse = await axios.get(requestUrl, config)
      return new RequestResult(initialResponse.data, null)
  }catch(error){
    return new RequestResult(null, <Error errMessage="Error" />);
  }     
}


export async function authorizedPutRequest(requestURL, accessToken){
  config.headers.accessToken = accessToken
  try{
    const initialResponse = await axios.put(requestURL, config)
    return new RequestResult(initialResponse.data, null)
}catch(error){
    return new RequestResult(null, <Error errMessage="Error" />);
}  
}

export async function authorizedPostRequest(requestUrl, payload, headers, accessToken){
  config.headers.accessToken = accessToken
  try{
    const initialResponse = await axios.post(requestUrl, payload, config)
    return new RequestResult(initialResponse.data, null)
  }catch(error){
    return new RequestResult(null, <Error errMessage="Error" />);
  }   
}

export async function authorizedDeleteRequest(requestURL, accessToken){
  config.headers.accessToken = accessToken
  try{
    const initialResponse = await axios.delete(requestURL, config)
    return new RequestResult(initialResponse.data, null)
  }catch(error){
    return new RequestResult(null, <Error errMessage="Error" />);
  }
}
    



