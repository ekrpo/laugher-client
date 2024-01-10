import axios from "axios"
import Error from "../components/Error/Error.js"

class RequestResult{
    constructor(data, err){
        this.data = data
        this.err = err
    }
}

export async function authorizedGetRequest(requestUrl){
  try{
      const initialResponse = await axios.get(requestUrl)
      return new RequestResult(initialResponse.data, null)
  }catch(error){
    return new RequestResult(null, <Error errMessage="Error" />);
  }     
}


export async function authorizedPutRequest(requestURL){
  try{
    const initialResponse = await axios.put(requestURL)
    return new RequestResult(initialResponse.data, null)
}catch(error){
    return new RequestResult(null, <Error errMessage="Error" />);
}  
}

export async function authorizedPostRequest(requestUrl, payload, headers){
  try{
    const initialResponse = await axios.post(requestUrl, payload, headers)
    return new RequestResult(initialResponse.data, null)
  }catch(error){
    return new RequestResult(null, <Error errMessage="Error" />);
  }   
}

export async function authorizedDeleteRequest(requestURL){
  try{
    const initialResponse = await axios.delete(requestURL)
    return new RequestResult(initialResponse.data, null)
  }catch(error){
    return new RequestResult(null, <Error errMessage="Error" />);
  }
}
    



