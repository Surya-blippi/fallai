// src/app/page.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fallai - Your AI Assistant',
  description: 'Fallai helps you accomplish more with advanced AI capabilities',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold mb-8">Welcome to Fallai</h1>
      </div>

      <div className="relative flex flex-col place-items-center">
        {/* Add your main content here */}
        <p className="mt-4 text-xl">
          Your AI-powered assistant for getting things done.
        </p>
      </div>

      <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-3 lg:text-left gap-8">
        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100">
          <h2 className="mb-3 text-2xl font-semibold">
            Feature One
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Description of your first main feature.
          </p>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100">
          <h2 className="mb-3 text-2xl font-semibold">
            Feature Two
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Description of your second main feature.
          </p>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100">
          <h2 className="mb-3 text-2xl font-semibold">
            Feature Three
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Description of your third main feature.
          </p>
        </div>
      </div>
    </main>
  )
}