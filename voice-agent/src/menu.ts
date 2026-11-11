import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
dotenv.config({path: fileURLToPath(new URL("../.env.local", import.meta.url)),});
// voice-agent/temp.js
const url = 'http://localhost:3000'
const VOICE_MENU_API_SECRET = process.env.VOICE_MENU_API_SECRET
// either importing the type menuItem which i think it would be a little hard because this could be hosted on vps other on vercel so i am just going to define it here 
type MenuItem = {
	id:string,
	name: string,
	category: string ,
	description: string,
	price: number,
	image: string,
	calories: string,
	prepTime: string,
	variants: string[],
	popular: boolean,
	spicy: false,
	aliases: string[],
	ingredients: string[],
}

console.log('secret loaded:', Boolean(VOICE_MENU_API_SECRET), '| length:', VOICE_MENU_API_SECRET?.length ?? 0)

if (!VOICE_MENU_API_SECRET) {
  console.error('VOICE_MENU_API_SECRET is not loaded — check your --env-file path')
  process.exit(1)
}


let cache: { items: MenuItem[], at: number } | null = null

async function loadMenu(menu:JSON): Promise<{ items: MenuItem[], at: number }> {
	if (cache) return cache
	if (!VOICE_MENU_API_SECRET || !url) {
		return ("Error Missing Credentials")
	}
	try {
		const res = await fetch(`${url}/api/voice/menu`, {
			method: 'GET',
			headers: { Authorization: `Bearer ${VOICE_MENU_API_SECRET}` },
		})
		const body = await res.json()
		console.log(body)
		console.log(body.products)
		
	} catch (error) {
		throw Error ("Menu couldn't be retreived")
	}
	
}

// loadMenu()

// 1. Check whether a valid cache exists.
//    If it does, return the cached items immediately.

// 2. Read the Next.js application URL from environment variables.

// 3. Read VOICE_MENU_API_SECRET from environment variables.

// 4. If either environment variable is missing,
//    throw a configuration error.

// 5. Send a GET request to:
//    `${APP_URL}/api/voice/menu`

//    Include the Authorization header:
//    Bearer <VOICE_MENU_API_SECRET>

// 6. If the response is unsuccessful,
//    throw an error indicating that the menu
//    could not be retrieved.

// 7. Parse the JSON response.
//    Expected structure: { products: [...] }










// import type { UUID } from "crypto"
// import { z } from "zod"

// // menu.ts
// export type MenuItem = {
// 	id:UUID,
// 	name:string, 
// 	category:string, 
// 	price:number, 
// 	variants: {
// 		id:UUID,
// 		name:string,
// 		price:number
// 	}[], 
// 	aliases: string[] 
// }

// const FIVE_MINUTES_IN_MS = 5 * 60 * 1000;

// let cache: { items: MenuItem[], at: number } | null = null

// async function loadMenu(): Promise<MenuItem[]> {
//   if (cache && Date.now() - cache.at < FIVE_MINUTES_IN_MS) return cache.items
//   const response = fetch(SUPABASE_URL + "/rest/v1/products?select=…&is_available=eq.true",{

// 	  headers: { apikey: ANON_KEY, Authorization: Bearer ANON_KEY }})

//   if (!response.ok) throw ToolError("The menu isn't available right now.")
//   rows = await response.json()
//   normalize each row → { category: row.categories?.name ?? "Uncategorized", variants…, aliases: name.toLowerCase().split(" ") }
//   cache = { items, at: now }
//   return items
// }

// function groupOverview(items): string   // "Burgers (12), Sides (8), …"
// function itemLines(items, limit = 8): string
// function search(items, query, limit = 5): MenuItem[]
