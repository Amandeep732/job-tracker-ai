import { NextResponse } from 'next/server'
import { verifyJwtMiddleware } from './middlewares/auth.middleware'

const PROTECTED_PATHS = ["/logout"];
export async function middleware(request) {
      const path = request.nextUrl.pathname;

      if(PROTECTED_PATHS.some((p) => p.startsWith(path))){
         return verifyJwtMiddleware(request)
      }
      return NextResponse.next()
}
 
export const config = {
  matcher: ["/((?!api|_next/static|favicon.ico).*)"],
};