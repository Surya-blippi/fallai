// src/app/page.tsx
'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'

export default function Home() {
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState('')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result)
        }
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type.startsWith('image/')) {
        try {
          const base64String = await convertToBase64(file)
          setSelectedImage(base64String)
          setInputValue('') // Clear text input when image is selected
        } catch (error) {
          console.error('Error converting image:', error)
          alert('Error processing image')
        }
      } else {
        alert('Please select an image file')
      }
    }
  }

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault()
    const file = event.dataTransfer.files?.[0]
    if (file) {
      if (file.type.startsWith('image/')) {
        try {
          const base64String = await convertToBase64(file)
          setSelectedImage(base64String)
          setInputValue('') // Clear text input when image is dropped
        } catch (error) {
          console.error('Error converting image:', error)
          alert('Error processing image')
        }
      } else {
        alert('Please drop an image file')
      }
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)
    setSelectedImage(null) // Clear image when text is entered
  }

  const handleSolve = async () => {
    setIsLoading(true)
    try {
      const payload: {
        text?: string
        imageUrl?: string
      } = {}

      if (inputValue) {
        payload.text = inputValue
      }

      if (selectedImage) {
        payload.imageUrl = selectedImage
      }

      const response = await fetch('/api/solve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      setResult(data.result)
    } catch (error) {
      console.error('Error:', error)
      setResult('An error occurred while processing your request')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Fallai Solver</h1>
            <p className="mt-2 text-gray-600">Type or upload an image</p>
          </div>

          {/* Universal Input Box */}
          <div 
            className={`relative border-2 border-dashed rounded-lg transition-colors ${
              selectedImage 
                ? 'border-gray-300' 
                : 'border-gray-300 hover:border-gray-400 focus-within:border-blue-500'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {selectedImage ? (
              // Image Preview
              <div className="relative h-64 w-full">
                <Image
                  src={selectedImage}
                  alt="Selected"
                  fill
                  className="object-contain rounded-lg"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                  title="Remove image"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            ) : (
              // Text Input
              <textarea
                value={inputValue}
                onChange={handleInputChange}
                className="w-full h-32 p-4 rounded-lg focus:outline-none resize-none"
                placeholder="Type your question or drop an image here..."
              />
            )}

            {/* Upload Button */}
            <div className="absolute bottom-2 right-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-gray-500 hover:text-blue-500 p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="Upload image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <path d="M20.4 14.5L16 10 4 20"/>
                </svg>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>

          {/* Solve Button */}
          <button
            onClick={handleSolve}
            disabled={isLoading || (!inputValue && !selectedImage)}
            className={`w-full mt-4 py-3 px-4 rounded-lg text-white font-medium transition-colors ${
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

          {/* Result Area */}
          {result && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">Result</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{result}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}