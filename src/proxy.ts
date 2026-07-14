import { withAuth } from 'next-auth/middleware'

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
})

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/po-pop/:path*',
    '/claim-memo/:path*',
    '/bantuan/:path*',
    '/admin/:path*'
  ],
}
