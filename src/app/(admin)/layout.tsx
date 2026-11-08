import { ReactNode } from "react";
import {getCurrentUserRole} from "@/lib/auth"
import { redirect } from "next/navigation";

export default async function AdminLayout({children}:{children:ReactNode}) {
	
	const role = await getCurrentUserRole()
	if(role === "admin") return( <>{children}</>)
	else if (role === "customer") redirect("/")
	else redirect("/auth/signin")
}