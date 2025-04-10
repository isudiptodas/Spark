import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { jwtVerify } from 'jose';

export async function middleware(req: NextRequest) {

    const token = req.cookies.get('token')?.value;
    //console.log(token);

    if (!token) {
        return NextResponse.redirect(new URL('/unauthorize', req.url));
    }

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        //console.log('Decoded payload:', payload);

        return NextResponse.next();
    } catch (err) {
        console.log(err);
        return NextResponse.redirect(new URL('/unauthorize', req.url));
    }
}

export const config = {
    matcher: ['/new-chat', '/chat/:path*']
}