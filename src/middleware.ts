import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if the user is on the login page
  const isLoginPage = request.nextUrl.pathname === '/login'
  
  // Get the wallet address from cookies if it exists
  const walletAddress = request.cookies.get('phantom-wallet')

  // If user is logged in and tries to access login page, redirect to home
  if (walletAddress && isLoginPage) {
    return NextResponse.redirect(new URL('/home', request.url))
  }

  // If user is not logged in and tries to access protected routes, redirect to login
  if (!walletAddress && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: ['/login', '/home']
} 