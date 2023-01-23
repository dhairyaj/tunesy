import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {

    //Token Exists if user is logged in    
    const token = await getToken({ req, secret: process.env.JWT_SECRET });

    // Fetch the pathname in the url being passed
    const { pathname, origin } = req.nextUrl;

    // Allow only if user has token or is trying to request for authentication
    if (pathname.includes('/api/auth') || token) {
        return NextResponse.next();
    }

    // Redirect to login page if no token and trying to access application

    if (!token && pathname !== '/login') {
        return NextResponse.redirect(`${origin}/login`);
    }

}

/*Has been added due to an issue of the following version combination of NextJS and React
"next": "13.1.4",
"next-auth": "^4.18.8",
"react": "18.2.0",*/
export const config = {
    matcher: "/",
};