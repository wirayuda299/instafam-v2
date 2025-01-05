
'use server'

import { SERVER_URL } from "@/constants";
import { CloudinaryResponse } from "@/types";


export async function uploadImage(formData:FormData):Promise<CloudinaryResponse>{
  try {    
    const uploadResponse=await fetch(SERVER_URL+'/image/upload',{
      method:'POST',
      body:formData
    })
  if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.message || "Upload failed");
      }

      return await uploadResponse.json();

  } catch (error) {
   throw error 
  }
}


export async function deleteImage(id:string) {
  try {
    
    const deleteRes= await fetch(SERVER_URL+'/image/delete', {
      method:'DELETE',
      credentials:'include',
      headers:{
        'content-type':'application/json'
      },
      body:JSON.stringify({
        id
      })
    })

    if(!deleteRes.ok){
      const errorData = await deleteRes.json();
      throw new Error(errorData.message || "Delete failed");
    }

    return "success"

  } catch (error) {
    throw error
  }
  
}