// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

// Initialize Inter font
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fallai - AI Assistant',
  description: 'Your intelligent AI assistant for everyday tasks',
  keywords: ['AI', 'Assistant', 'Productivity', 'Automation'],
  authors: [{ name: 'Your Name' }],
  viewport: 'width=device-width, initial-scale=1',
}

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              {/* Logo */}
              <div className="flex items-center">
                <a href="/" className="text-xl font-bold">
                  Fallai
                </a>
              </div>

              {/* Navigation */}
              <nav className="hidden md:flex items-center space-x-8">
                <a href="/features" className="text-sm font-medium hover:text-gray-600">
                  Features
                </a>
                <a href="/pricing" className="text-sm font-medium hover:text-gray-600">
                  Pricing
                </a>
                <a href="/about" className="text-sm font-medium hover:text-gray-600">
                  About
                </a>
              </nav>

              {/* Auth/Profile Section */}
              <div className="flex items-center space-x-4">
                <a href="/login" className="text-sm font-medium hover:text-gray-600">
                  Login
                </a>
                
                  href="/signup"
                  className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                >
                  Sign Up
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t bg-white">
          <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {/* Company Info */}
              <div>
                <h3 className="text-sm font-semibold">Company</h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <a href="/about" className="text-sm text-gray-600 hover:text-gray-900">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="/careers" className="text-sm text-gray-600 hover:text-gray-900">
                      Careers
                    </a>
                  </li>
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h3 className="text-sm font-semibold">Resources</h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <a href="/docs" className="text-sm text-gray-600 hover:text-gray-900">
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a href="/blog" className="text-sm text-gray-600 hover:text-gray-900">
                      Blog
                    </a>
                  </li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h3 className="text-sm font-semibold">Legal</h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <a href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">
                      Privacy
                    </a>
                  </li>
                  <li>
                    <a href="/terms" className="text-sm text-gray-600 hover:text-gray-900">
                      Terms
                    </a>
                  </li>
                </ul>
              </div>

              {/* Social */}
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
      </body>
    </html>
  )
}