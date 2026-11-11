import { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server";
import { getPublicMenuProducts } from "@/services/publicMenuService"

const VOICE_MENU_API_SECRET = process.env.VOICE_MENU_API_SECRET

export async function GET(request: NextRequest){

	const auth = request.headers.get('authorization')
	if (!auth?.startsWith('Bearer ')) {
		return Response.json({ error: 'Unauthorized' }, { status: 401 })
	}	
	if(!VOICE_MENU_API_SECRET){
		return Response.json({ error: 'Server Configuration Error' }, { status: 500 })
	}
	// 7 is the number of *Bearer * character which is a part of the request
	const token = auth.slice(7).trim();

	if(!(token === VOICE_MENU_API_SECRET) ){
		return Response.json({ error: 'Unauthorized' }, { status: 401 });
	}
	else{

		try{
			const supabase = await createClient();
			const products = await getPublicMenuProducts(supabase)
			return Response.json({ products }, { status: 200 })
			
		}catch(error){
			console.log(error)
			return Response.json({error: "There were an unexpected error"}, { status: 500 })
		}
	}
}
// TRY:

//     CREATE a server-side Supabase client.

//     CALL the existing getPublicMenuProducts() function,
//     passing the Supabase client.

//     STORE the returned products.