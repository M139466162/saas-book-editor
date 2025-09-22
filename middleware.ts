import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // Restrict /admin to admins only
    if (req.nextUrl.pathname.startsWith('/admin')) {
      const role = (req as any).nextauth?.token?.role
      if (role !== 'admin') {
        return NextResponse.redirect(new URL('/', req.url))
      }
    }
    return NextResponse.next()
  },
  {
    pages: {
      signIn: '/login',
    },
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname
        // public routes
        const publicPaths = ['/login']
        if (publicPaths.includes(path)) return true
        return !!token
      },
    },
  }
)

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|fonts|images).*)'],
}
