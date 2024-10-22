// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fallai - AI Assistant',
  description: 'Your intelligent AI assistant for everyday tasks',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                {/* Logo */}
                <Link href="/" className="text-xl font-bold">
                  Fallai
                </Link>

                {/* Navigation */}
                <nav className="hidden md:flex items-center space-x-8">
                  <Link href="/features" className="text-sm font-medium hover:text-gray-600">
                    Features
                  </Link>
                  <Link href="/pricing" className="text-sm font-medium hover:text-gray-600">
                    Pricing
                  </Link>
                  <Link href="/about" className="text-sm font-medium hover:text-gray-600">
                    About
                  </Link>
                </nav>

                {/* Auth Buttons */}
                <div className="flex items-center space-x-4">
                  <Link href="/login" className="text-sm font-medium hover:text-gray-600">
                    Login
                  </Link>
                  <Link href="/signup" className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
                    Sign Up
                  </Link>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>

          {/* Footer */}
          <footer className="border-t bg-white">
            <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                <div>
                  <h3 className="text-sm font-semibold">Company</h3>
                  <ul className="mt-4 space-y-2">
                    <li>
                      <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900">
                        About
                      </Link>
                    </li>
                    <li>
                      <Link href="/careers" className="text-sm text-gray-600 hover:text-gray-900">
                        Careers
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-semibold">Resources</h3>
                  <ul className="mt-4 space-y-2">
                    <li>
                      <Link href="/docs" className="text-sm text-gray-600 hover:text-gray-900">
                        Documentation
                      </Link>
                    </li>
                    <li>
                      <Link href="/blog" className="text-sm text-gray-600 hover:text-gray-900">
                        Blog
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-semibold">Legal</h3>
                  <ul className="mt-4 space-y-2">
                    <li>
                      <Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">
                        Privacy
                      </Link>
                    </li>
                    <li>
                      <Link href="/terms" className="text-sm text-gray-600 hover:text-gray-900">
                        Terms
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-semibold">Social</h3>
                  <ul className="mt-4 space-y-2">
                    <li>
                      <a href="https://twitter.com" className="text-sm text-gray-600 hover:text-gray-900" target="_blank" rel="noopener noreferrer">
                        Twitter
                      </a>
                    </li>
                    <li>
                      <a href="https://github.com" className="text-sm text-gray-600 hover:text-gray-900" target="_blank" rel="noopener noreferrer">
                        GitHub
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 border-t pt-8">
                <p className="text-sm text-gray-600">
                  © {new Date().getFullYear()} Fallai. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}