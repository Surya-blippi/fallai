// src/app/page.tsx
'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'

export default function Home() {
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const handleSolve = async () => {
    setIsLoading(true)
    try {
      // Here you'll add your API call to process the input
      console.log('Processing:', inputValue)
      setResult('Result will appear here')
    } catch (error) {
      console.error('Error:', error)
      setResult('An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    const file = event.dataTransfer.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Fallai Solver</h1>
            <p className="mt-2 text-gray-600">Enter your question or upload an image</p>
          </div>

          {/* Input Area */}
          <div className="space-y-4">
            {/* Text Input */}
            <div>
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Type your question here..."
              />
            </div>

            {/* Image Upload Area */}
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {selectedImage ? (
                <div className="relative h-48 w-full">
                  <Image
                    src={selectedImage}
                    alt="Selected"
                    fill
                    className="object-contain"
                  />
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Upload an image
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*"
                    className="hidden"
                  />
                  <p className="text-gray-500 mt-2">or drag and drop</p>
                </div>
              )}
            </div>

            {/* Solve Button */}
            <button
              onClick={handleSolve}
              disabled={isLoading || (!inputValue && !selectedImage)}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
                isLoading || (!inputValue && !selectedImage)
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Processing...
                </span>
              ) : (
                'Solve'
              )}
            </button>
          </div>

          {/* Result Area */}
          {result && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">Result</h2>
              <p className="text-gray-700">{result}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}