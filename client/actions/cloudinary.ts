
'use server'

import { RequestConfig, SERVER_URL } from "@/constants";
import { CloudinaryResponse } from "@/types";


export async function uploadImage(formData: FormData): Promise<CloudinaryResponse> {
  try {
    const requestConf = new RequestConfig('POST')
    requestConf.setBody(formData)

    const uploadResponse = await fetch(SERVER_URL + '/image/upload', requestConf.toRequestInit())

    if (!uploadResponse.ok) {
      const res = await uploadResponse.json()
      console.log(res)
      throw new Error(res.message || "Upload failed");
    }

    return await uploadResponse.json();

  } catch (error) {
    throw error
  }
}


export async function deleteImage(id: string) {
  try {
    const requestConf = new RequestConfig('DELETE')
    requestConf.setBody(JSON.stringify({ id }))

    const deleteRes = await fetch(SERVER_URL + '/image/delete', requestConf.toRequestInit())

    if (!deleteRes.ok) {
      const errorData = await deleteRes.json();
      throw new Error(errorData.message || "Delete failed");
    }

    return "success"

  } catch (error) {
    throw error
  }

}