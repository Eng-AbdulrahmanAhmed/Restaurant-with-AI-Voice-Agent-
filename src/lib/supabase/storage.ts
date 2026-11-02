import { createClient } from './client'

export async function uploadProductImage(
  productId: string,
  file: File
) {
  const supabase = createClient()

  // Generate a unique filename
  const extension = file.name.split('.').pop()
  const fileName = `${crypto.randomUUID()}.${extension}`

  // Organize images by product ID
  const imagePath = `products/${productId}/${fileName}`

  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(imagePath, file, {
      contentType: file.type,
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    throw error
  }

  // Generate the public URL
  const { data: publicUrlData } = supabase.storage
    .from('product-images')
    .getPublicUrl(data.path)

  return {
    path: data.path,
    publicUrl: publicUrlData.publicUrl,
  }
}