
'use server'


export type CloudinaryResponse = {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string; // ISO date string
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  folder: string;
  access_mode: string;
  original_filename: string;
  api_key: string;
};
export async function uploadImage(formData:FormData):Promise<CloudinaryResponse>{
  try {
    
    const uploadResponse=await fetch(process.env.SERVER_URL+'/upload/image',{
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
